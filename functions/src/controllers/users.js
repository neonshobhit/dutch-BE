const {
  db,
} = require("../config/firebase");
const qrCodeImage = require("../services/QRcode");
const jwt = require("jsonwebtoken");
const secret = require("../config/env").jwt.secret;
const speakeasy = require("speakeasy");

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
    await newUser.update({
      secretId: docId.id,
    });
    // Making an empty friend document, so to maintain consistency.
    // Not waiting because,
    // this request can be completed even after the execution of results.
    await db.collection("friends").doc(newUser.id).set({});

    const data = {
      newUser: (await newUser.get()).data(),
      id: newUser.id,
      otp,
    };
    return res.status(200).json(data);
  } else {
    let id;
    snapshot.forEach((e) => id = e.id);
    const data = {
      id,
      error: "Email Id already exists",
    };
    return res.status(403).json(data);
  }
};

exports.verifyUser = async (req, res) => {
  const {
    email,
    token,
  } = req.body;
  const snapshot = await db
    .collection("users")
    .where("email", "==", req.body.email)
    .get();
  if (snapshot.empty) {
    return res.status(401).json({
      error: "Unauthorized person!",
    });
  } else {
    let id;
    snapshot.forEach((e) => id = e.id);
    try {
      const user = await db.collection("users").doc(id);
      const userData = (await user.get()).data();
      const secret = await user.collection("userSecret").doc(userData.secretId);
      const secretData = (await secret.get()).data();

      if (!user.isVerified) {
        if (token === secretData.otp.toString()) {
          await user.update({
            isVerified: true,
          });
          return res.status(200).json({
            statusCode: 200,
            message: "User Verified Done.",
          });
        } else {
          return res.status(401).json({
            error: "Otp Doesn't match",
          });
        }
      } else {
        return res.status(200).json({
          message: "User is Already verified.",
        });
      }
    } catch (err) {
      return res.status(501).json({
        error: "Internal Server Error.",
      });
    }
  }
};

exports.getQrCode = async (req, res) => {
  const {
    email,
  } = req.body;
  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();
  if (snapshot.empty) {
    return res.status(401).json({
      error: "Unauthorized Person",
    });
  } else {
    let id;
    snapshot.forEach((e) => id = e.id);
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
        return res.status(200).json({
          image_url: qrCodeOutput.url,
        });
      } else {
        return res.status(500).json({
          error: "Inernal Server Error",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(501).json({
        error: "Internal Server Error.",
      });
    }
  }
};

exports.signin = async (req, res) => {
  const {
    email,
    verificationOtp,
  } = req.body;
  const snapshot = await db
    .collection("users")
    .where("email", "==", email).get();
  if (snapshot.empty) {
    return res.status(401).json({
      error: "Unauthorized Person",
    });
  } else {
    try {
      let id;
      snapshot.forEach((e) => id = e.id);
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
        const token = jwt.sign({
          email,
          id,
        }, secret);
        return res.status(200).json({
          user: {
            email,
            id,
          },
          message: "User Signin Done.",
          token,
        });
      } else {
        return res.status(400).json({
          error: "Otp Doen't Match",
        });
      }
    } catch (err) {
      return res.status(501).json({
        error: "Internal Server Error.",
      });
    }
  }
};

exports.addFriend = async (req, res) => {
  const _b = req.body;

  const checkAlreadyFriend = await db
    .collection("users")
    .doc(_b.userId)
    .collection("friends")
    .doc(_b.otherUser)
    .get();

  if (checkAlreadyFriend.exists) {
    return res.status(208).json({
      message: "Friend already added!",
    });
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

  return res.status(200).json({});
};

exports.fetchFriends = async (req, res) => {
  const userId = req.userId;

  const out = {};
  await db.collection("users").doc(userId).collection("friends").get()
    .then((snap) => {
      out.statusCode = 200;
      out.data = [];
      snap.forEach((e) => {
        out.data.push({
          [e.id]: e.data(),
        });
      });
    })
    .catch((err) => {
      out.statusCode = 400;
      out.error = err.message;
    });
  // log(out)

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
