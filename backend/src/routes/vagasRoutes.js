const express = require('express');
const router = express.Router();

const { autenticar, adminOuEmpresa } = require('../middlewares/auth');
const vagasCtrl = require('../controllers/vagasController');

router.get('/', autenticar, vagasCtrl.listarVagas);
router.get('/:id', autenticar, vagasCtrl.detalheVaga);
router.post('/', autenticar, adminOuEmpresa, vagasCtrl.criarVaga);
router.put('/:id', autenticar, adminOuEmpresa, vagasCtrl.atualizarVaga);
router.get('/:vaga_id/ranking', autenticar, adminOuEmpresa, vagasCtrl.rankingCandidatos);

module.exports = router;
