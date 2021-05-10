const {
    db
} = require('../config/firebase');
const QrCodeImage = require("../services/QRcode");
// const speakeasy = require("speakeasy");
var otp;

exports.add = async (req, res) => {
    let snapshot = await db.collection('users').where('email', '==', req.body.email).get();

    if (snapshot.empty) {

        otp = Math.floor(100000 + Math.random() * 900000);

        let newUser = await db.collection('users').add({
            email: req.body.email,
            isVerified: false,
            // Cumulative of all groups for paying and receiving for this user
            toPay: 0,
            toReceive: 0
        })
        return {
            statusCode: 200,
            newUser: (await newUser.get()).data(),
            id: newUser.id,
            otp,
        }

    } else {
        let id
        snapshot.forEach(e => id = e.id)
        return {
            id,
            statusCode: 403,
            error: "Email Id already exists"
        }
    }
}

exports.verifyUser = async (req, res) => {
    const token = req.body.otp;
    if (otp !== token) {
        return {
            statusCode: 401,
            error: "Invlid OTP"
        }
    } else {
        let _b = req.body;
        let result;
        await db.collection('users').doc(_b.id).update({
            isVerified: true,
        }).then(data => {
            otp = undefined;
            result = {
                id: _b.id,
                statusCode: 200,
                email: req.body.email,
            }
        }).catch(err => {
            result = {
                statusCode: 400,
                error: err.message
            }
        })
        return result;
    }
}

exports.getQrCode = async (req, res) => {
    const {
        email,
        secret
    } = req.body;
    let snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) {
        return {
            statusCode: 401,
            error: "Unauthorized Person"
        }
    } else {
        // const secret = speakeasy.generateSecret();
        const qrCodeOutput = QrCodeImage(secret.otpauth_url);
        if (qrCodeOutput.flag) {
            return {
                statusCode: 200,
                image_url: qrCodeOutput.url
            }
        } else {
            return {
                statusCode: 500,
                error: "Inernal Server Error"
            }
        }
    }
}

exports.addFriend = async (req, res) => {
    const _b = req.body

    let checkAlreadyFriend = await db
        .collection('users')
        .doc(_b.userId)
        .collection('friends')
        .doc(_b.otherUser)
        .get()
    if (checkAlreadyFriend.exists) {
        return {
            statusCode: 208,
            message: "Friend already added!",
        }
    }

    // If both are added to each other than only they'll be saved, else rollback will happen.
    // Atomic operations.
    const batch = db.batch();

    let f12 = db.collection('users').doc(_b.userId).collection('friends').doc(_b.otherUser)
    let f21 = db.collection('users').doc(_b.otherUser).collection('friends').doc(_b.userId)

    batch.set(f12, {
        isGuest: false,
        owe: 0, // +ve -> userid will pay otherId, -ve -> otherId will pay userId.
    })
    batch.set(f21, {
        isGuest: false,
        owe: 0 // cumulative of all the groups where they have some relation pending
    })

    await batch.commit();

    return {
        statusCode: 200
    }
}

exports.fetchFriends = async (req, res) => {
    const userId = req.userId

    let out = new Object()
    await db.collection('users').doc(userId).collection('friends').get()
        .then(snap => {
            out.statusCode = 200
            out.data = []
            snap.forEach(e => {
                out.data.push({
                    [e.id]: e.data()
                })
            })
        })
        .catch(err => {
            out.statusCode = 400;
            out.error = err.message
        })
    // log(out)

    return out
}