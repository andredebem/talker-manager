const express = require('express');
const randtoken = require('rand-token');

const router = express.Router();

router.post('/login', (req, res, next) => {
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

module.exports = router;