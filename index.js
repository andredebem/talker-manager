const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, ele é necessário para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const talkerRouter = require('./talkerRouter');

app.use('/talker', talkerRouter);

app.use((err, req, res, _next) => { 
  res.status(`${err.status}`).json({ message: `${err.message}` });
});

app.listen(PORT, () => {
  console.log('Online');
});
