const express = require('express');
const router = express.Router();

const candidaturasController = require('../controllers/candidaturasController');
const { autenticar } = require('../middlewares/auth');

router.post(
  '/',
  autenticar,
  candidaturasController.criarCandidatura
);

module.exports = router;