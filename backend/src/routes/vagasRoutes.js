const express = require('express');
const router = express.Router();

const { autenticar, adminOuEmpresa } = require('../middlewares/auth');
const vagasCtrl = require('../controllers/vagasController');

router.get('/', vagasCtrl.listarVagas);
router.get('/:id', vagasCtrl.detalheVaga);

router.post('/', autenticar, adminOuEmpresa, vagasCtrl.criarVaga);
router.put('/:id', autenticar, adminOuEmpresa, vagasCtrl.atualizarVaga);
router.get('/:vaga_id/ranking', autenticar, adminOuEmpresa, vagasCtrl.rankingCandidatos);
router.post(
    '/rejeitar-candidato',
    autenticar,
    vagasCtrl.rejeitarCandidato
);

module.exports = router;