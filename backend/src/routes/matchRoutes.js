const express = require('express');
const router = express.Router();

const matchController = require('../controllers/matchController')
const { autenticar, soCandidato } = require('../middlewares/auth');

router.get(
  '/matches/candidato',
  autenticar,
  matchController.getMatchesPorCandidato
);

router.post(
  "/recusar",
  autenticar,
  soCandidato,
  matchController.recusarVaga
);

module.exports = router;