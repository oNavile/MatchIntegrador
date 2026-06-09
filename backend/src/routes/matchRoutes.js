const express = require('express');
const router = express.Router();

const matchController = require('../controllers/matchController')
const { autenticar } = require('../middlewares/auth');

router.get(
  '/matches/candidato',
  autenticar,
  matchController.getMatchesPorCandidato
);

module.exports = router;