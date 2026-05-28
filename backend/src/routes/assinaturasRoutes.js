const express = require('express');
const router = express.Router();

const assinaturasController = require('../controllers/assinaturasController');

router.post('/', assinaturasController.criar);
router.get('/:empresaId', assinaturasController.buscarPorEmpresa);
router.put('/cancelar/:empresaId', assinaturasController.cancelar);

module.exports = router;
