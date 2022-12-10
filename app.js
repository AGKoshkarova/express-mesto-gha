const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { ERROR_404, MESSAGE_404 } = require("./errors/errors");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('*', (req, res, next) => {
  res.status(ERROR_404).send({ message: MESSAGE_404 });

  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: "63905976c446265e3ec7bff5", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(userRouter);
app.use(cardRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
