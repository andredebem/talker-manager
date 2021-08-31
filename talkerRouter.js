const fs = require('fs').promises;

const express = require('express');

const router = express.Router();

const talkers = './talker.json';

router.get('/', async (req, res, next) => {
  try {
    const readTalkers = await fs.readFile(talkers);
    res.status(200).json(JSON.parse(readTalkers));
  } catch (error) {
    next({
      status: 500,
      message: error,
    });
  }
});

module.exports = router;