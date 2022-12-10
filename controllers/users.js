const User = require("../models/user");

// запрос на всех пользователей
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: `Произошла ошибка ${err}` });
  }
};

// запрос на поиск пользователя по его id
module.exports.getUser = async (req, res) => {
  console.log(req.params.userId);
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Запрашиваемый пользователь не найден" });
    }
    return res.status(200).json(user);
  } catch (err) {
    const ERROR_CODE = 400;
    if (((err.name === 'CastError') || (err.name === 'TypeError'))) {
      return res.status(ERROR_CODE).json({ message: "Переданы некорректные данные" });
    }
    console.log(err);
    return res.status(500).send({ message: `Произошла ошибка ${err}` });
  }
};

// запрос на создание пользователя
module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(201).json(newUser);
  } catch (err) {
    const ERROR_CODE = 400;
    if (((err.name === 'CastError') || (err.name === 'TypeError') || (err.name === 'ValidationError'))) {
      return res.status(ERROR_CODE).json({ message: "Переданы некорректные данные при создании пользователя" });
    }
    console.log(err);
    return res.status(500).send({ message: `Произошла ошибка ${err}` });
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
      return res.status(404).send({
        message: "Запрашиваемый пользователь не найден",
      });
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    const ERROR_CODE = 400;
    if (((err.name === 'CastError') || (err.name === 'TypeError') || (err.name === 'ValidationError'))) {
      return res.status(ERROR_CODE).json({ message: "Переданы некорректные данные при обновлении профиля" });
    }
    console.log(err);
    return res.status(500).send({ message: `Произошла ошибка ${err}` });
  }
};

// запрос на изменение аватара пользователя
module.exports.updateAvatar = async (req, res) => {
  console.log(req.user._id);
  try {
    const { avatar } = req.body;
    const updatedUserAvatar = await User.findByIdAndUpdate(
      req.user._id,
      avatar,
      { new: true, runValidators: true }
    );
    if (!updatedUserAvatar) {
      return res.status(404).send({
        message: "Запрашиваемый пользователь не найден",
      });
    }
    return res.status(200).json(updatedUserAvatar);
  } catch (err) {
    const ERROR_CODE = 400;
    if (((err.name === 'CastError') || (err.name === 'TypeError') || (err.name === 'ValidationError'))) {
      return res.status(ERROR_CODE).json({ message: "Переданы некорректные данные при обновлении аватара" });
    }
    console.log(err);
    return res.status(500).send({ message: `Произошла ошибка ${err}` });
  }
};
