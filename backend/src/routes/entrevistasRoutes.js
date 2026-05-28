const express = require('express');
const router = express.Router();

const { autenticar, adminOuEmpresa } = require('../middlewares/auth');
const entrevistaCtrl = require('../controllers/entrevistasController');

router.get('/', autenticar, entrevistaCtrl.listarEntrevistas);
router.post('/', autenticar, adminOuEmpresa, entrevistaCtrl.agendarEntrevista);
router.put('/:id', autenticar, entrevistaCtrl.atualizarEntrevista);

module.exports = router;
