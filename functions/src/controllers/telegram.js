const { db } = require("../config/firebase");
const eventsController = require("../controllers/events");
const Telegram = require("../models/Telegram").Telegram;

class Notification {
	constructor(curFlow, nextFlow, msg, id, notConversation, metadata) {
		this.msgId = id;
		this.curFlow = curFlow;
		this.nextFlow = nextFlow;
		this.curMessage = msg;
		this.isConversation = !notConversation; // if its undefined, it must be true
		this.timestamp = new Date().getTime();
		this.metadata = metadata;
	}
}

exports.storeMessage = async (msg, msgId, id, curFLow, nextFlow, metadata) => {
	if (!metadata) metadata = {};
	metadata = Buffer.from(JSON.stringify(metadata)).toString("base64");
	let entry = new Notification(curFLow, nextFlow, msg, msgId, true, metadata);
	entry = JSON.parse(JSON.stringify(entry));
	await db
		.collection("telegram")
		.doc(id + "")
		.collection("notifications")
		.add(entry);
};

exports.getLastMessage = async (id) => {
	const lastMessage = await db
		.collection("telegram")
		.doc(id + "")
		.collection("notifications")
		.limit(1)
		.orderBy("timestamp", "desc")
		.get();
	if (lastMessage.empty) {
		return {
			status: false,
			error: "NO_PREVIOUS_MESSAGE_FOUND",
		};
	}
	let msg = undefined;
	lastMessage.forEach((e) => {
		let data = e.data();
		if (data.metadata)
			data.metadata = JSON.parse(
				Buffer.from(data.metadata, "base64").toString("ascii"),
			);
		msg = {
			...data,
			id: e.id,
		};
	});

	return {
		status: true,
		msg: msg,
	};
};

exports.linkAccount = async (from, email) => {
	email = email.toLowerCase();
	const account = await db
		.collection("telegram")
		.doc(from.id + "")
		.get();
	if (account.exists)
		return {
			status: false,
			error: "ACCOUNT_ALREADY_LINKED",
			emailId: account.data().email,
		};

	const snapshot = await db
		.collection("users")
		.where("email", "==", email)
		.get();

	if (snapshot.empty)
		return {
			status: false,
			error: "EMAIL_ID_IS_NOT_REGISTERED",
		};

	// todo: verify totp before linking account
	// todo: batch write
	let id = undefined;
	snapshot.forEach((e) => (id = e.id));
	await db
		.collection("telegram")
		.doc(from.id + "")
		.set({
			email: email,
			isBot: from.is_bot,
			firstName: from.first_name ? from.first_name : "telegram",
			lastName: from.last_name ? from.last_name : "user",
			username: from.username,
			languageCode: from.language_code,
			userId: id,
		});

	await db.collection("users").doc(id).update({
		telegramId: from.id,
	});

	return {
		status: true,
	};
};

exports.getLinkedAccount = async (from) => {
	const account = await db
		.collection("telegram")
		.doc(from.id + "")
		.get();
	if (account.exists) {
		let accountDetails = account.data();
		const user = await db
			.collection("users")
			.doc(accountDetails.userId)
			.get();
		if (user.exists) {
			return {
				status: true,
				account: user.data(),
			};
		}

		return {
			status: false,
			error: "USER_DOES_NOT_EXIST",
		};
	}
	return {
		status: false,
		error: "ACCOUNT_NOT_LINKED",
	};
};

exports.getProfile = async (from) => {
	const account = await db
		.collection("telegram")
		.doc(from.id + "")
		.get();
	if (account.exists) {
		let accountDetails = account.data();
		const user = await db
			.collection("users")
			.doc(accountDetails.userId)
			.get();
		if (user.exists) {
			return {
				status: true,
				account: {
					...user.data(),
					id: user.id,
				},
			};
		}

		return {
			status: false,
			error: "ACCOUNT_LINKED_TO_UNKNOWN_USER",
		};
	}

	return {
		status: false,
		error: "ACCOUNT_NOT_LINKED",
	};
};

exports.getSentMessage = async (msg) => {
	const notification = await db
		.collection("telegram")
		.doc(msg.chat.id + "")
		.collection("notifications")
		.where("msgId", "==", msg.reply_to_message.message_id)
		.get();
	if (notification.empty) {
		return {
			status: false,
			error: "SENT_MESSAGE_NOT_FOUND",
		};
	}

	let noti = undefined;
	notification.forEach((e) => (noti = e.data()));

	return {
		status: true,
		msg: noti,
	};
};

exports.listEvents = async (from) => {
	const account = await db
		.collection("telegram")
		.doc(from.id + "")
		.get();
	if (account.exists) {
		let accountDetails = account.data();
		const events = await db
			.collection("users")
			.doc(accountDetails.userId)
			.collection("events")
			.get();
		if (!events.empty) {
			return {
				status: true,
				events: events.docs.map((e) => e.data()),
			};
		}

		return {
			status: false,
			error: "NO_EVENTS",
		};
	}

	return {
		status: false,
		error: "ACCOUNT_NOT_LINKED",
	};
};

exports.getUsers = async (msg) => {
	const acc = await exports.getProfile(msg.from);
	if (!acc.status) return acc;

	const groups = await db
		.collection("users")
		.doc(acc.account.id + "")
		.collection("events")
		.where("name", "==", msg.text)
		.get();
	if (groups.empty)
		return {
			status: false,
			error: "NO_GROUPS_FOR_USER_ACCOUNT",
		};

	// considering last message of the list of matched groups
	let ev = {};
	groups.forEach((e) => (ev.eventId = e.id));

	const members = await eventsController.getMembersList(ev);
	members.event = ev;
	return members;
};

exports.getEventUser = async (metadata) => {
	const event = await db.collection("events").doc(metadata.eventId).get();
	if (!event.exists)
		return {
			status: false,
			error: "NO_EVENT_FOUND",
		};

	let member = undefined;

	event.data().members.forEach((v, ind, arr) => {
		if (v.name === metadata.user) member = v;
	});

	if (!member)
		return {
			status: false,
			error: "USER_NOT_FOUND",
		};

	return {
		status: true,
		user: member,
	};
};

exports.subscribeEvent = async (msg, metadata) => {
	const acc = await exports.getProfile(msg.from);
	if (!acc.status) return acc;

	const eventDoc = await db.collection("events").doc(metadata.eventId);
	const event = await eventDoc.get();

	if (!event.exists)
		return {
			status: false,
			error: "NO_EVENT_FOUND",
		};

	const groups = await eventDoc
		.collection("telegram_notify")
		.where("chatid", "==", msg.chat.id)
		.where("isSubscribed", "==", true)
		.get();

	if (!groups.empty) {
		return {
			status: false,
			error: "EVENT_ALREADY_IN_SUBSCRIPTION_LIST",
		};
	}

	const unsubgroup = await eventDoc
		.collection("telegram_notify")
		.where("chatid", "==", msg.chat.id)
		.where("isSubscribed", "==", false)
		.get();

	if (!unsubgroup.empty) {
		await eventDoc
			.collection("telegram_notify")
			.where("chatid", "==", msg.chat.id)
			.where("isSubscribed", "==", false)
			.limit(1)
			.get()
			.then((query) => {
				const thing = query.docs[0];
				let tmp = thing.data();
				tmp.isSubscribed = true;
				thing.ref.update(tmp);
			});
		return {
			status: true,
		};
	}
	await eventDoc
		.collection("telegram_notify")
		.doc()
		.set({
			chatid: msg.chat.id,
			firstName: msg.chat.first_name ? msg.chat.first_name : "telegram",
			lastName: msg.chat.last_name ? msg.chat.last_name : "user",
			username: msg.chat.username,
			isSubscribed: true,
		});
	return {
		status: true,
	};
};

exports.unSubscribedEvents = async (msg, metadata) => {
	const acc = await exports.getProfile(msg.from);
	if (!acc.status) return acc;

	const eventDoc = await db.collection("events").doc(metadata.eventId);
	const event = await eventDoc.get();

	if (!event.exists)
		return {
			status: false,
			error: "EVENT_IS_NOT_PRESENT_IN_SUBSCRIPTION_LIST",
		};

	const groups = await eventDoc
		.collection("telegram_notify")
		.where("chatid", "==", msg.chat.id)
		.where("isSubscribed", "==", true)
		.get();

	if (groups.empty)
		return {
			status: false,
			error: "EVENT_IS_NOT_PRESENT_IN_SUBSCRIPTION_LIST",
		};

	await eventDoc
		.collection("telegram_notify")
		.where("chatid", "==", msg.chat.id)
		.where("isSubscribed", "==", true)
		.limit(1)
		.get()
		.then((query) => {
			const thing = query.docs[0];
			let tmp = thing.data();
			tmp.isSubscribed = false;
			thing.ref.update(tmp);
		});

	return {
		status: true,
	};
};
