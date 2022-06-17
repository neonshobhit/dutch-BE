const nodemailer = require("nodemailer");

const config = require("./../config/env");

const transport = nodemailer.createTransport({
	service: "Gmail",
	secure: false,
	port: 25,
	auth: {
		user: config.email.from_email,
		pass: config.password.email_password,
	},
	tls: {
		rejectUnauthorized: false,
	},
});
/* *
 * @function: sendOtp
 * @description: Send otp to user
 * @param {string} email
 * @param {string} otp
 * @returns {boolean}
 */
module.exports = async (email, otp) => {
	await transport.sendMail(
		{
			from: config.email.from_email,
			to: email,
			subject: "Otp Confirmation.",
			html: `<h2>Your Otp for verification is: ${otp}`,
		},
		(err, data) => {
			if (err) return false;
			return true;
		},
	);
};
