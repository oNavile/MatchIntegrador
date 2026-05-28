const express = require('express');
const router = express.Router();

const planosController = require('../controllers/planosController');

router.get('/', planosController.listar);
router.get('/:id', planosController.buscarPorId);

module.exports = router;
