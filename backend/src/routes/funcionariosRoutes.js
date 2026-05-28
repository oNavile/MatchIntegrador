const express = require('express');
const router = express.Router();

const { autenticar, adminOuEmpresa } = require('../middlewares/auth');
const funcCtrl = require('../controllers/funcionariosController');

router.get('/', autenticar, adminOuEmpresa, funcCtrl.listarFuncionarios);
router.get('/ranking', autenticar, adminOuEmpresa, funcCtrl.rankingFuncionarios);
router.get('/:id', autenticar, adminOuEmpresa, funcCtrl.detalheFuncionario);
router.post('/admitir', autenticar, adminOuEmpresa, funcCtrl.admitirFuncionario);
router.put('/:id', autenticar, adminOuEmpresa, funcCtrl.atualizarFuncionario);
router.put('/:id/desligar', autenticar, adminOuEmpresa, funcCtrl.desligarFuncionario);

module.exports = router;
