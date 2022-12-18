const ERROR_401 = 401;
const ERROR_404 = 404;
const STATUS_200 = 200;
const STATUS_201 = 201;
const url = /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/;

const MESSAGE_400 = 'Переданы некорректные данные';
const MESSAGE_401 = 'Ошибка авторизации';
const MESSAGE_403 = 'Доступ к ресурсу запрещен';
const MESSAGE_404 = 'Пользователь или карточка не найдены';
const MESSAGE_409 = 'Пользователь с таким email уже зарегистрирован';
const MESSAGE_500 = 'Произошла ошибка';
const MESSAGE_200 = 'Успешно';

module.exports = {
  ERROR_401,
  ERROR_404,
  STATUS_200,
  STATUS_201,
  MESSAGE_400,
  MESSAGE_401,
  MESSAGE_403,
  MESSAGE_404,
  MESSAGE_409,
  MESSAGE_500,
  MESSAGE_200,
  url,
};
