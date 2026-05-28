const express = require('express');
const router = express.Router();

const { autenticar, soCandidato } = require('../middlewares/auth');
const vagasCtrl = require('../controllers/vagasController');

router.post('/', autenticar, soCandidato, vagasCtrl.candidatar);

module.exports = router;
