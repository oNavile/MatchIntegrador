const express = require('express');
const router = express.Router();

const { autenticar, adminOuEmpresa } = require('../middlewares/auth');
const vagasCtrl = require('../controllers/vagasController');

// ROTAS PÚBLICAS
router.get('/', vagasCtrl.listarVagas);
router.get('/:id', vagasCtrl.detalheVaga);

// ROTAS PROTEGIDAS
router.post('/', autenticar, adminOuEmpresa, vagasCtrl.criarVaga);
router.put('/:id', autenticar, adminOuEmpresa, vagasCtrl.atualizarVaga);
router.get('/:vaga_id/ranking', autenticar, adminOuEmpresa, vagasCtrl.rankingCandidatos);

module.exports = router;