const express = require('express');
const router = express.Router();

const { autenticar } = require('../middlewares/auth'); 
const favoritoCtrl = require('../controllers/favoritosController');

router.get('/', autenticar, favoritoCtrl.listarFavoritos);
router.post('/toggle', autenticar, favoritoCtrl.alternarFavorito);

module.exports = router;