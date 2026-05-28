const express = require('express');
const router = express.Router();

const { autenticar, adminOuEmpresa } = require('../middlewares/auth');
const rhCtrl = require('../controllers/rhController');

router.get('/setores', autenticar, adminOuEmpresa, rhCtrl.listarSetores);
router.post('/setores', autenticar, adminOuEmpresa, rhCtrl.criarSetor);
router.put('/setores/:id', autenticar, adminOuEmpresa, rhCtrl.editarSetor);
router.delete('/setores/:id', autenticar, adminOuEmpresa, rhCtrl.deletarSetor);

router.get('/cargos', autenticar, adminOuEmpresa, rhCtrl.listarCargos);
router.post('/cargos', autenticar, adminOuEmpresa, rhCtrl.criarCargo);
router.put('/cargos/:id', autenticar, adminOuEmpresa, rhCtrl.editarCargo);
router.delete('/cargos/:id', autenticar, adminOuEmpresa, rhCtrl.deletarCargo);

module.exports = router;
