const fs = require('fs').promises;
const express = require('express');

const router = express.Router();
const talkerLocation = './talker.json';

async function readTalkers(req, res, next) {
  try {
    const file = await fs.readFile(talkerLocation);

    req.arrayTalkers = JSON.parse(file);

    next();
  } catch (error) {
    next({
      status: 500,
      message: error,
    });
  }
}

async function overwriteTalker(req, res, next) {
  try {
    const { newArrayTalkers } = req;
    const newFile = JSON.stringify(newArrayTalkers);

    await fs.writeFile('./talker.json', newFile, 'utf-8');

    next();
  } catch (error) {
    next({
      status: 500,
      message: error,
    });
  }
}

function validateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return next({ status: 401, message: 'Token não encontrado' });

  if (token.length < 16) return next({ status: 401, message: 'Token inválido' });

  next();
}

function validateNameAndAge(req, res, next) {
    const { name, age } = req.body;

    if (!name) return next({ status: 400, message: 'O campo "name" é obrigatório' });
    if (name.length < 3) {
      return next({ status: 400, message: 'O "name" deve ter pelo menos 3 caracteres' });
    }

    if (!age) return next({ status: 400, message: 'O campo "age" é obrigatório' });
    if (age < 18) {
      return next({ status: 400, message: 'A pessoa palestrante deve ser maior de idade' });
    }

    next();
}

function validateTalk(req, res, next) {
  const { talk } = req.body;

  if (!talk || !talk.watchedAt || !talk.rate) {
    return next({
      status: 400,
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }
  
  next();
}

function validateWatchedAtAndRate(req, res, next) {
  const { talk: { watchedAt, rate } } = req.body;
  
  const dateFormat = /^(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{4}$/;
  if (dateFormat.test(watchedAt) === false) {
    return next({ status: 400, message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  if (rate < 1 || rate > 5) {
    return next({ status: 400, message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
}

router.get('/', readTalkers, (req, res) => {
  const { arrayTalkers } = req;
  
  res.status(200).json(arrayTalkers);
});

router.post('/', validateToken, validateNameAndAge, validateTalk,
validateWatchedAtAndRate, readTalkers, (req, res, next) => {
  const { arrayTalkers } = req;
  const newTalker = req.body;

  newTalker.id = arrayTalkers.length + 1;

  arrayTalkers.push(newTalker);

  req.newArrayTalker = arrayTalkers;

  next();
}, overwriteTalker, readTalkers, (req, res) => {
  const { arrayTalkers } = req;

  const addedTalker = arrayTalkers[arrayTalkers.length - 1];

  res.status(201).json(addedTalker);
});

router.get('/:id', readTalkers, (req, res, next) => {
  const { id } = req.params;
  const { arrayTalkers } = req;
  
  const findTalker = arrayTalkers.find((talker) => talker.id === parseInt(id, 10));

  if (!findTalker) return next({ status: 404, message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(findTalker);
});

module.exports = router;
