const User = require("../models/user");
const {
  ERROR_400,
  ERROR_404,
  ERROR_500,
  MESSAGE_404,
  MESSAGE_400,
  MESSAGE_500,
} = require("../errors/errors");

// запрос на всех пользователей
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(ERROR_500).json({ message: MESSAGE_500 });
  }
};

// запрос на поиск пользователя по его id
module.exports.getUser = async (req, res) => {
  console.log(req.params.userId);
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res
        .status(ERROR_404)
        .json({ message: MESSAGE_404 });
    }
    return res.status(200).json(user);
  } catch (err) {
    if ((err.name === 'CastError') || (err.name === 'TypeError')) {
      return res.status(ERROR_400).json({ message: ERROR_400 });
    }
    console.log(err);
    return res.status(ERROR_500).json({ message: MESSAGE_500 });
  }
};

// запрос на создание пользователя
module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(201).json(newUser);
  } catch (err) {
    if ((err.name === 'CastError') || (err.name === 'TypeError') || (err.name === 'ValidationError')) {
      return res.status(400).json({ message: 'блабла' });
    }
    console.log(err);
    return res.status(ERROR_500).json({ message: MESSAGE_500 });
  }
};

// запрос на обновление имя и описания пользователя в профиле
module.exports.updateProfile = async (req, res) => {
  console.log(req.user._id);
  try {
    const { name, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(ERROR_404).send({
        message: MESSAGE_404,
      });
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    if ((err.name === 'CastError') || (err.name === 'TypeError') || (err.name === 'ValidationError')) {
      return res.status(ERROR_400).json({ message: MESSAGE_400 });
    }
    console.log(err);
    return res.status(ERROR_500).json({ message: MESSAGE_500 });
  }
};

// запрос на изменение аватара пользователя
module.exports.updateAvatar = async (req, res) => {
  console.log(req.user._id);
  try {
    const { avatar } = req.body;
    const updatedUserAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!updatedUserAvatar) {
      return res.status(ERROR_404).send({
        message: MESSAGE_404,
      });
    }
    return res.status(200).json(updatedUserAvatar);
  } catch (err) {
    if ((err.name === 'CastError') || (err.name === 'TypeError') || (err.name === 'ValidationError')) {
      return res.status(ERROR_400).json({ message: MESSAGE_400 });
    }
    console.log(err);
    return res.status(ERROR_500).json({ message: MESSAGE_500 });
  }
};
