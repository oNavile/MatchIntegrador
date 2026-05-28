const express = require('express');
const router = express.Router();

const pagamentosController = require('../controllers/pagamentosController');

router.post('/', pagamentosController.criar);
router.get('/:empresaId', pagamentosController.listarPorEmpresa);

module.exports = router;
