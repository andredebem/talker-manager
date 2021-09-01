const fs = require('fs').promises;
const express = require('express');

const router = express.Router();
const talkerLocation = './talker.json';

async function readTalkers(req, res, next) {
  try {
    const file = await fs.readFile(talkerLocation);

    req.talkers = JSON.parse(file);

    next();
  } catch (error) {
    next({
      status: 500,
      message: error,
    });
  }
}

router.get('/', readTalkers, (req, res) => {
  const { talkers } = req;

  // if (!talkers) return next({ status: 500, message: 'Error searching talkers!' });
  
  res.status(200).json(talkers);
});

router.get('/:id', readTalkers, (req, res, next) => {
  const { id } = req.params;
  const { talkers } = req;
  
  const findTalker = talkers.find((talker) => talker.id === parseInt(id, 10));

  if (!findTalker) return next({ status: 404, message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(findTalker);
});

module.exports = router;
