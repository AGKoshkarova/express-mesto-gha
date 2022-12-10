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
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({
        message: "Запрашиваемый пользователь не найден",
      });
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: `Произошла ошибка ${err}` });
  }
};

// запрос на изменение аватара пользователя
module.exports.updateAvatar = async (req, res) => {
  console.log(req.user._id);
  try {
    const updatedUserAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.user.avatar },
      { new: true }
    );
    if (!updatedUserAvatar) {
      return res.status(404).send({
        message: "Запрашиваемый пользователь не найден",
      });
    }
    return res.status(200).json(updatedUserAvatar);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: `Произошла ошибка ${err}` });
  }
};
