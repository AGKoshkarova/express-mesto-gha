const jwt = require('jsonwebtoken');
const { MESSAGE_401 } = require('../utils/constants');
const AuthorizationError = require('../errors/auth-err');

module.exports.checkAuth = (req, res, next) => {
  const token = req.headers.authorization || req.cookies.jwt;

  if (!token) {
    return next(new AuthorizationError(MESSAGE_401));
  }

  const secretKey = 'my_secret_token_key';
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    console.log(err);
    return next(new AuthorizationError(MESSAGE_401));
  }

  req.user = payload;

  return next();
};
