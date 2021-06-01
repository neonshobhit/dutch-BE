const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

const firebaseConfig = {
  apiKey: "AIzaSyDd_LOCOk_0bQ5Qi7EiRXZYyKFm0KSSG9s",
  authDomain: "dutch-dfd21.firebaseapp.com",
  projectId: "dutch-dfd21",
  storageBucket: "dutch-dfd21.appspot.com",
  messagingSenderId: "476844463720",
  appId: "1:476844463720:web:5bd37b4063be71008a8ddd",
  measurementId: "G-W19HJ3HP4T",
  credential: admin.credential.cert(serviceAccount),
};

admin.initializeApp(firebaseConfig);

module.exports = {
  db: admin.firestore(),
  firebase: admin,
};
