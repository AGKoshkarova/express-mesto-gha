const Card = require('../models/card');
const {
  STATUS_200,
  STATUS_201,
  MESSAGE_404,
  MESSAGE_400,
  MESSAGE_403,
} = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/baq-req-err');
const AccesError = require('../errors/acces-err');

// запрос на получение всех карточек
module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(STATUS_200).json(cards);
  } catch (err) {
    return next(err);
  }
};

// запрос на создание карточки
module.exports.createCard = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const { name, link } = req.body;

    const card = await Card.create({
      name,
      link,
      owner: ownerId,
    });
    return res.status(STATUS_201).json(card);
  } catch (err) {
    if ((err.name === 'ValidationError')) {
      return next(new BadRequestError(MESSAGE_400));
    }
    return next(err);
  }
};

// запрос на удаление карточки
module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(new NotFoundError(MESSAGE_404));
    }
    const owner = card.owner.toHexString();
    if (owner !== req.user._id) {
      return next(new AccesError(MESSAGE_403));
    }
    await card.remove();
    return res.status(STATUS_200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(MESSAGE_400));
    }
    return next(err);
  }
};

// запрос на постановку лайка карточке
module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError(MESSAGE_404));
    }
    card.populate(['likes']);
    return res.status(STATUS_200).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(MESSAGE_400));
    }
    return next(err);
  }
};

// запрос на снятие лайка с карточки
module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError(MESSAGE_404));
    }
    card.populate(['likes']);
    return res.status(STATUS_200).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(MESSAGE_400));
    }
    return next(err);
  }
};
