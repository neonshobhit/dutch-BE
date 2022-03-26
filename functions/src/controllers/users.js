const { db } = require("../config/firebase");
const qrCodeImage = require("../services/QRcode");
const sendOtp = require("../services/sendOtp");
const speakeasy = require("speakeasy");
const { encode } = require("../services/auth");

exports.add = async (req, res) => {
	const snapshot = await db
		.collection("users")
		.where("email", "==", req.body.email)
		.get();

	if (snapshot.empty) {
		const otp = Math.floor(100000 + Math.random() * 900000);

		const newUser = await db.collection("users").add({
			email: req.body.email,
			isVerified: false,
			// Cumulative of all groups for paying and receiving for this user
			toPay: 0,
			toReceive: 0,
		});

		const docId = await newUser.collection("userSecret").add({
			otp: otp,
		});
		const doc = await newUser.collection("userSecret").doc("telegram").set({
			otp: otp,
		});
		await newUser.update({
			secretId: docId.id,
		});
		// telegram

		// Making an empty friend document, so to maintain consistency.
		// Not waiting because,
		// this request can be completed even after the execution of results.
		await db.collection("friends").doc(newUser.id).set({});

		// send otp to mail.
		await sendOtp(req.body.email, otp);
		const data = {
			statusCode: 200,
			email: req.body.email,
		};
		return data;
	} else {
		let id;
		snapshot.forEach((e) => (id = e.id));
		const data = {
			statusCode: 403,
			id,
			error: "Email Id already exists",
		};
		return data;
	}
};

exports.verifyUser = async (req, res) => {
	const { email, token } = req.body;
	const snapshot = await db
		.collection("users")
		.where("email", "==", req.body.email)
		.get();
	if (snapshot.empty) {
		return {
			statusCode: 401,
			error: "Unauthorized person!",
		};
	} else {
		let id;
		snapshot.forEach((e) => (id = e.id));
		try {
			const user = await db.collection("users").doc(id);
			const userData = (await user.get()).data();
			const secret = await user
				.collection("userSecret")
				.doc(userData.secretId);
			const secretData = (await secret.get()).data();

			if (!user.isVerified) {
				if (token === secretData.otp.toString()) {
					await user.update({
						isVerified: true,
					});
					return {
						statusCode: 200,
						message: "User Verified Done.",
					};
				} else {
					return {
						statusCode: 401,
						error: "Otp Doesn't match",
					};
				}
			} else {
				return {
					statusCode: 200,
					message: "User is Already verified.",
				};
			}
		} catch (err) {
			return {
				statusCode: 501,
				error: "Internal Server Error.",
			};
		}
	}
};

exports.getQrCode = async (req, res) => {
	const { email } = req.body;
	const snapshot = await db
		.collection("users")
		.where("email", "==", email)
		.get();
	if (snapshot.empty) {
		return {
			statusCode: 401,
			error: "Unauthorized Person",
		};
	} else {
		let id;
		snapshot.forEach((e) => (id = e.id));
		try {
			const user = await db.collection("users").doc(id);
			const userData = (await user.get()).data();
			const secretData = await user
				.collection("userSecret")
				.doc(userData.secretId);
			const secretCode = speakeasy.generateSecret();
			const qrCodeOutput = qrCodeImage(secretCode.otpauth_url);
			await secretData.update({
				secret: secretCode,
			});
			if (qrCodeOutput.flag) {
				return {
					statusCode: 200,
					image_url: qrCodeOutput.url,
				};
			} else {
				return {
					statusCode: 500,
					error: "Inernal Server Error",
				};
			}
		} catch (err) {
			return {
				statusCode: 501,
				error: "Internal Server Error.",
			};
		}
	}
};

exports.signin = async (req, res) => {
	const { email, verificationOtp } = req.body;
	const snapshot = await db
		.collection("users")
		.where("email", "==", email)
		.get();
	if (snapshot.empty) {
		return {
			statusCode: 401,
			error: "Unauthorized Person",
		};
	} else {
		try {
			let id;
			snapshot.forEach((e) => (id = e.id));
			const user = await db.collection("users").doc(id);
			const userData = (await user.get()).data();
			const secretDataInfo = await user
				.collection("userSecret")
				.doc(userData.secretId);
			const secretData = (await secretDataInfo.get()).data();
			const tokenValidates = speakeasy.totp.verify({
				secret: secretData.secret.base32,
				encoding: "base32",
				token: verificationOtp,
			});
			if (tokenValidates) {
				const token = encode(email, id);
				return {
					statusCode: 200,
					message: "User Signin Done.",
					token,
				};
			} else {
				return {
					statusCode: 400,
					error: "Otp Doen't Match",
				};
			}
		} catch (err) {
			return {
				statusCode: 501,
				error: "Internal Server Error.",
			};
		}
	}
};

exports.addFriend = async (req, res) => {
	const _b = {};
	_b["userId"] = req.user.userId;

	const snapshot = await db
		.collection("users")
		.where("email", "==", req.body.otherEmail)
		.get();
	let id;
	snapshot.forEach((e) => (id = e.id));
	if (snapshot.empty) {
		return {
			statusCode: 401,
			message: "Other User Doesn't exist.",
		};
	}
	_b["otherUser"] = id;

	const checkAlreadyFriend = await db
		.collection("users")
		.doc(_b.userId)
		.collection("friends")
		.doc(_b.otherUser)
		.get();

	if (checkAlreadyFriend.exists) {
		return {
			statusCode: 208,
			message: "Friend already added!",
		};
	}

	// If both are added to each other than only they'll be saved,
	// else rollback will happen.
	// Atomic operations.
	const batch = db.batch();

	const f12 = db
		.collection("users")
		.doc(_b.userId)
		.collection("friends")
		.doc(_b.otherUser);
	const f21 = db
		.collection("users")
		.doc(_b.otherUser)
		.collection("friends")
		.doc(_b.userId);

	batch.set(f12, {
		isGuest: false,
		owe: 0, // +ve -> userid will pay otherId, -ve -> otherId will pay userId.
	});
	batch.set(f21, {
		isGuest: false,
		owe: 0,
		// cumulative of all the groups where they have some relation pending
	});

	await batch.commit();

	return {
		statusCode: 200,
	};
};

exports.fetchFriends = async (req, res) => {
	const userId = req.user.userId;
	let out = {};
	await db
		.collection("users")
		.doc(userId)
		.collection("friends")
		.get()
		.then((snap) => {
			const data = [];
			snap.forEach((e) => {
				data.push({
					id: e.id,
					...e.data(),
				});
			});
			out = {
				statusCode: 200,
				data,
			};
		})
		.catch((err) => {
			out = {
				statusCode: 400,
				error: err.message,
			};
		});
	return out;
};

exports.profile = async (body) => {
	const user = await db.collection("users").doc(body.userId).get();

	return {
		user: user.data(),
		id: user.id,
		statusCode: 200,
	};
};

exports.listEvents = async (body) => {
	const events = await db
		.collection("users")
		.doc(body.userId)
		.collection("events")
		.get();
	let response = events.docs.map((e) => e.data());

	return {
		data: response,
		statusCode: 200,
	};
};
