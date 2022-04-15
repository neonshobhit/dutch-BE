let helpMsg = "HELP_MESSAGE",
	startMsg = "START_MESAGE",
	selEv = "SELECT_EVENT",
	linkAcc = "LINK_ACCOUNT",
	subscribeEvent = "SUBSCRIBE_EVENT",
	unsubscribeEvent = "UNSUBSCRIBE_EVENT",
	selectNotifiedEvent = "SELECT_NOTIFY_EVENT",
	deselectNotifiedEvent = "DESELECT_NOTIFY_EVENT",
	linkEmail = "LINKING_EMAIL_ID",
	success = "SUCCESS",
	profile = "GET_PROFILE",
	linkEv = "LIST_EVENTS",
	addTrn = "ADD_TRANSACTION",
	askPaidBy = "PAID_BY",
	askAmount = "GET_AMOUNT",
	confPay = "CONFIRM_PAYMENT",
	errorMsg = "ERROR_MESSAGE";

class Telegram {
	static HELP_MESSAGE = new Telegram(helpMsg);
	static START_MESSAGE = new Telegram(startMsg);
	static SELECT_EVENT = new Telegram(selEv);
	static LINK_ACCOUNT = new Telegram(linkAcc);
	static SUBSCRIBE_EVENT = new Telegram(subscribeEvent);
	static UNSUBSCRIBE_EVENT = new Telegram(unsubscribeEvent);
	static SELECT_NOTIFY_EVENT = new Telegram(selectNotifiedEvent);
	static DESELECT_NOTIFY_EVENT = new Telegram(deselectNotifiedEvent);
	static LINKING_EMAIL_ID = new Telegram(linkEmail);
	static GET_PROFILE = new Telegram(profile);
	static LIST_EVENTS = new Telegram(linkEv);
	static ADD_TRANSACTION = new Telegram(addTrn);
	static ASK_PAID_BY = new Telegram(askPaidBy);
	static CONFIRM_PAYMENT = new Telegram(confPay);
	static GET_AMOUNT = new Telegram(askAmount);
	static SUCCESS = new Telegram(success);
	static ERROR_MSG = new Telegram(errorMsg);

	constructor(name) {
		this.getString = name;
	}
	static getString(wrapper) {
		switch (wrapper) {
			case this.HELP_MESSAGE:
				return helpMsg;
			case this.START_MESSAGE:
				return startMsg;
			case this.SELECT_EVENT:
				return selEv;
			case this.LINK_ACCOUNT:
				return linkAcc;
			case this.SUBSCRIBE_EVENT:
				return subscribeEvent;
			case this.UNSUBSCRIBE_EVENT:
				return unsubscribeEvent;
			case this.SELECT_NOTIFY_EVENT:
				return selectNotifiedEvent;
			case this.DESELECT_NOTIFY_EVENT:
				return deselectNotifiedEvent;
			case this.LINKING_EMAIL_ID:
				return linkEmail;
			case this.GET_PROFILE:
				return profile;
			case this.LIST_EVENTS:
				return linkEv;
			case this.ADD_TRANSACTION:
				return addTrn;
			case this.ASK_PAID_BY:
				return askPaidBy;
			case this.CONFIRM_PAYMENT:
				return confPay;
			case this.GET_AMOUNT:
				return askAmount;
			case this.SUCCESS:
				return success;
			case this.ERROR_MSG:
				return errorMsg;
		}
	}
	static getWrapper(str) {
		switch (str) {
			case helpMsg:
				return this.HELP_MESSAGE;
			case startMsg:
				return this.START_MESSAGE;
			case selEv:
				return this.SELECT_EVENT;
			case linkAcc:
				return this.LINK_ACCOUNT;
			case subscribeEvent:
				return this.SUBSCRIBE_EVENT;
			case unsubscribeEvent:
				return this.UNSUBSCRIBE_EVENT;
			case selectNotifiedEvent:
				return this.SELECT_NOTIFY_EVENT;
			case deselectNotifiedEvent:
				return this.DESELECT_NOTIFY_EVENT;
			case linkEmail:
				return this.LINKING_EMAIL_ID;
			case profile:
				return this.GET_PROFILE;
			case linkEv:
				return this.LIST_EVENTS;
			case addTrn:
				return this.ADD_TRANSACTION;
			case askPaidBy:
				return this.ASK_PAID_BY;
			case confPay:
				return this.CONFIRM_PAYMENT;
			case askAmount:
				return this.GET_AMOUNT;
			case success:
				return this.SUCCESS;
			case errorMsg:
				return this.ERROR_MSG;
			default:
				throw new Error("wrapper not found");
		}
	}

	static generateMessage(wrapper, params) {
		switch (wrapper) {
			case this.HELP_MESSAGE: {
				let msg = `/addTransaction\n/linkAccount\n/subscribeEvent\n/unsubscribeEvent\n/myLinkedEmail\n/getEvents\n/getProfile\n/getFriendsDue`;
				let options = {
					entities: [
						{
							type: "email",
						},
					],
				};
				return [msg, options];
			}

			case this.START_MESSAGE: {
				let msg = `/addTransaction\n/linkAccount\n/subscribeEvent\n/unsubscribeEvent\n/myLinkedEmail\n/getEvents\n/getProfile\n/getFriendsDue`;
				let options = {
					entities: [
						{
							type: "email",
						},
					],
				};
				return [msg, options];
			}

			case this.SELECT_EVENT: {
				let msg = "Who paid?";
				let options = {
					reply_markup: {
						force_reply: true,
						one_time_keyboard: true,
						selective: true,
						inline_keyboard: [],
					},
					reply_to_message_id: params.message_id,
				};

				params.users.forEach((v, ind, arr) => {
					options.reply_markup.inline_keyboard.push([
						{
							text: v.name,
							switch_inline_query_current_chat: v.name,
						},
					]);
				});
				return [msg, options];
			}
			case this.LINK_ACCOUNT: {
				let msg = "Email Id?";
				let options = {
					reply_markup: {
						force_reply: true,
					},
				};

				return [msg, options];
			}

			case this.SUBSCRIBE_EVENT: {
				let msg = "Select an event to get notification?";
				let options = {
					reply_markup: {
						force_reply: true,
						one_time_keyboard: true,
						inline_keyboard: [],
					},
					reply_to_message_id: params.message_id,
				};
				params.events.forEach((v, ind, arr) => {
					options.reply_markup.inline_keyboard.push([
						{
							text: v.name,
							switch_inline_query_current_chat: v.eventId,
						},
					]);
				});

				return [msg, options];
			}

			case this.UNSUBSCRIBE_EVENT: {
				let msg = "Select an event to unsubscribe?";
				let options = {
					reply_markup: {
						force_reply: true,
						one_time_keyboard: true,
						inline_keyboard: [],
					},
					reply_to_message_id: params.message_id,
				};

				params.events.forEach((v, ind, arr) => {
					options.reply_markup.inline_keyboard.push([
						{
							text: v.name,
							switch_inline_query_current_chat: v.eventId,
						},
					]);
				});
				return [msg, options];
			}
			case this.SELECT_NOTIFY_EVENT: {
				let msg = "Success!";
				let options = {
					entities: [
						{
							type: "email",
						},
					],
				};

				return [msg, options];
			}
			case this.DESELECT_NOTIFY_EVENT: {
				let msg = "Success!";
				let options = {
					entities: [
						{
							type: "email",
						},
					],
				};

				return [msg, options];
			}

			case this.LINKING_EMAIL_ID: {
				let msg = "Success!";
				let options = {
					entities: [
						{
							type: "email",
						},
					],
				};

				return [msg, options];
			}

			case this.GET_PROFILE: {
				let msg = JSON.stringify(params);
				let options = {
					entities: [
						{
							type: "email",
						},
					],
				};

				return [msg, options];
			}

			case this.LIST_EVENTS: {
				let msg = `List of your events: `;
				params.events.forEach((v, ind, arr) => {
					msg += `\n${v.name}: ${v.imageURL}`;
				});
				let options = {
					entities: [
						{
							type: "email",
						},
					],
				};

				return [msg, options];
			}

			case this.ADD_TRANSACTION: {
				let msg = "Please select event";
				let options = {
					reply_markup: {
						force_reply: true,
						one_time_keyboard: true,
						inline_keyboard: [],
					},
					reply_to_message_id: params.message_id,
				};
				params.events.forEach((v, ind, arr) => {
					options.reply_markup.inline_keyboard.push([
						{
							text: v.name,
							switch_inline_query_current_chat: v.name,
						},
					]);
				});

				return [msg, options];
			}

			case this.ASK_PAID_BY: {
				let msg = "Amount?";
				let options = {
					reply_markup: {
						force_reply: true,
						one_time_keyboard: true,
						selective: true,
						inline_keyboard: [],
					},
					reply_to_message_id: params.message_id,
				};

				options.reply_markup.inline_keyboard.push([
					{
						text: " ",
						switch_inline_query_current_chat: " ",
					},
				]);
				return [msg, options];
			}

			case this.GET_AMOUNT: {
				let msg = `You sure that ${params.user} paid ${params.amount} in ${params.eventName}?`;
				let options = {
					reply_markup: {
						force_reply: true,
						one_time_keyboard: true,
						selective: true,
						keyboard: [["@Dutchbebot Yes"], ["@Dutchbebot No"]],
					},
				};

				return [msg, options];
			}

			case this.CONFIRM_PAYMENT: {
				let msg = "Success";
				let options = {};
				return [msg, options];
			}

			case this.SUCCESS: {
				let msg = "Success";
				let options = {};

				return [msg, options];
			}

			case this.ERROR_MSG: {
				let msg = `Retry Flow`;
				let options = {};

				return [msg, options];
			}
		}
	}
}

exports.Telegram = Telegram;
