const Card = require("../models/card");

// запрос на получение всех карточек
module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Произошла ошибка ${err}` });
  }
};

// запрос на создание карточки
module.exports.createCard = async (req, res) => {
  console.log(req.user._id); // _id станет доступен

  try {
    const ownerId = req.user._id;
    const { name, link } = req.body;

    const card = await Card.create({
      name,
      link,
      owner: ownerId,
    });
    return res.status(201).json(card);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Произошла ошибка ${err}` });
  }
};

// запрос на удаление карточки
module.exports.deleteCard = async (req, res) => {
  console.log(req.params.cardId);
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      return res.status(404).send({
        message: "Такой карточки не существует",
      });
    }
    return res.status(200).send(card);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Произошла ошибка ${err}` });
  }
};

// запрос на постановку лайка карточке
module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    );
    card.populate(['likes']);
    if (!card) {
      return res.status(404).send({
        message: "Такой карточки не существует",
      });
    }
    return res.status(200).json({ message: 'Лайк успешно добавлен' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Произошла ошибка ${err}` });
  }
};

// запрос на снятие лайка с карточки
module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    );
    card.populate(['likes']);
    if (!card) {
      return res.status(404).send({
        message: "Такой карточки не существует",
      });
    }
    return res.status(200).json({ message: 'Лайк успешно снят' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Произошла ошибка ${err}` });
  }
};
