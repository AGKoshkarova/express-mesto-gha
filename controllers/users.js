const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const validator = require('validator');
const User = require('../models/user');
const {
  STATUS_200,
  STATUS_201,
  MESSAGE_400,
  MESSAGE_401,
  MESSAGE_404,
  MESSAGE_409,
} = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const AuthorizationError = require('../errors/auth-err');
const BadRequestError = require('../errors/baq-req-err');
const EmailError = require('../errors/email-err');

// запрос на всех пользователей
module.exports.getUsers = async (req, res, next) => {
  console.log(req.cookies.jwt);
  try {
    const users = await User.find({});
    return res.status(STATUS_200).json(users);
  } catch (err) {
    // console.log(err);
    // return res.status(ERROR_500).json({ message: MESSAGE_500 });
    return next(err);
  }
};

// запрос на поиск пользователя по его id
module.exports.getUser = async (req, res, next) => {
  console.log(req.cookies.jwt);
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      // return res.status(ERROR_404).json({ message: MESSAGE_404 });
      return next(new NotFoundError(MESSAGE_404));
    }
    return res.status(STATUS_200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      // return next(new BadRequestError(MESSAGE_400));
      return res.status(400).json({ message: MESSAGE_400 });
    }
    // console.log(err);
    // return res.status(ERROR_500).json({ message: MESSAGE_500 });
    return next(err);
  }
};

// запрос на создание пользователя
module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(STATUS_201).json({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      // return res.status(ERROR_400).json({ message: MESSAGE_400 });
      return next(new BadRequestError(MESSAGE_400));
    }
    if (err.code === 11000) {
      return next(new EmailError(MESSAGE_409));
    }
    // console.log(err);
    // return res.status(ERROR_500).json({ message: MESSAGE_500 });
    return next(err);
  }
};

// запрос на обновление имя и описания пользователя в профиле
module.exports.updateProfile = async (req, res, next) => {
  console.log(req.cookies.jwt);
  try {
    const { name, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      // return res.status(ERROR_404).send({
      //   message: MESSAGE_404,
      // });
      return next(new NotFoundError(MESSAGE_404));
    }
    return res.status(STATUS_200).json(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      // return res.status(ERROR_400).json({ message: MESSAGE_400 });
      return next(new BadRequestError(MESSAGE_400));
    }
    // console.log(err);
    // return res.status(ERROR_500).json({ message: MESSAGE_500 });
    return next(err);
  }
};

// запрос на изменение аватара пользователя
module.exports.updateAvatar = async (req, res, next) => {
  console.log(req.cookies.jwt);
  try {
    const { avatar } = req.body;
    const updatedUserAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUserAvatar) {
      // return res.status(ERROR_404).send({
      //   message: MESSAGE_404,
      // });
      return next(new NotFoundError(MESSAGE_404));
    }
    return res.status(STATUS_200).json(updatedUserAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      // return res.status(ERROR_400).json({ message: MESSAGE_400 });
      return next(new BadRequestError(MESSAGE_400));
    }
    // console.log(err);
    // return res.status(ERROR_500).json({ message: MESSAGE_500 });
    return next(err);
  }
};

// запрос на логин (контроллер аутентификации)
module.exports.login = async (req, res, next) => {
  console.log(req.cookies.jwt);
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    if (!email || !password) {
      return next(new AuthorizationError(MESSAGE_401));
    }
    const secretKey = 'my_secret_token_key';
    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });
    return res.send({ data: user.toJSON() });
  } catch (err) {
    return next(err);
    // return res.status(ERROR_401).json({ message: MESSAGE_401 });
    // console.log(err);
    // return res.status(ERROR_500).json({ message: MESSAGE_500 });
  }
};

// запрос на получение информации о текущем пользователе
module.exports.getUserInformation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError(MESSAGE_404));
    }
    return res.status(STATUS_200).json(user);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
