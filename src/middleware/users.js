const jwt = require("jsonwebtoken");
const secret = require('../config/env').jwt.secret

exports.checkValidation = async (req, res) => {
    const {
        token
    } = req.body;
    let output;
    jwt.verify(token, secret, (err, user) => {
        if (err || !user) {
            output = {
                statusCode: 401,
                error: "Invalid Token"
            }
        } else {
            req.user = user;
            output = {
                statusCode: 200,
                user
            }
        }
    });
    return output;
}