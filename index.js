const express = require('express');
const bodyParser = require('body-parser');
const randtoken = require('rand-token');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, ele é necessário para fazer o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const talkerRouter = require('./talkerRouter');

app.use('/talker', talkerRouter);

app.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!email) return next({ status: 400, message: 'O campo "email" é obrigatório' });
  if (validEmail.test(email) === false) {
    return next({ status: 400, message: 'O "email" deve ter o formato "email@email.com"' });
  }

  if (!password) return next({ status: 400, message: 'O campo "password" é obrigatório' });
  if (password.length < 6) {
    return next({ status: 400, message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  const token = randtoken.generate(16);

  res.status(200).json({ token });
});

app.use((err, req, res, _next) => { 
  res.status(`${err.status}`).json({ message: `${err.message}` });
});

app.listen(PORT, () => {
  console.log('Online');
});
