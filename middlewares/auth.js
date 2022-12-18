const jwt = require('jsonwebtoken');
const { ERROR_401, MESSAGE_401 } = require('../utils/constants');

module.exports.checkAuth = (req, res, next) => {
  const token = req.headers.authorization || req.cookies.jwt;

  if (!token) {
    return res.status(ERROR_401).send({ message: MESSAGE_401 });
  }

  const secretKey = 'my_secret_token_key';
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    console.log(err);
    return res.status(ERROR_401).send({ message: MESSAGE_401 });
  }

  req.user = payload;

  return next();
};
