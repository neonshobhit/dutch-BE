module.exports = {
	jwt: {
		secret: "DUTCHAPPLICATION@1234512132sdfsdf",
	},
	server: {
		port: process.env.PORT,
	},
	telegram: {
		token: process.env.TELEGRAM_TOKEN,
	},
	email: {
		from_email: process.env.FROM_EMAIL,
	},
	password: {
		email_password: process.env.EMAIL_PASSWORD,
	},
};
