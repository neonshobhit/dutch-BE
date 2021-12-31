const jwt = require("jsonwebtoken");
const secret = require("../config/env").jwt.secret;

exports.encode = (email, id) => {
  const token = jwt.sign({
    emailId: email,
    userId: id,
  }, secret);
  return token;
};

exports.decode = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  let output;
  jwt.verify(token, secret, (err, user) => {
    if (err || !user) {
      output = {
        statusCode: 401,
        error: "Invalid Token",
      };
    } else {
      req.user = user;
      output = {
        statusCode: 200,
        user,
      };
    }
  });
  if (output.statusCode == 200) {
    next();
  } else {
    res.status(403).send({
      error: "Unauthorized",
    });
  }
  return output;
};
