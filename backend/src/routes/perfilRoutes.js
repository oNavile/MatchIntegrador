const express = require('express');
const router = express.Router();

const upload = require('../config/multer');
const { autenticar, adminOuEmpresa } = require('../middlewares/auth');
const perfilCtrl = require('../controllers/perfilController');

router.get('/', autenticar, perfilCtrl.meuPerfil);
router.put('/', autenticar, upload.single('arquivo'), perfilCtrl.editarPerfil);
router.get('/candidatos/:id', autenticar, adminOuEmpresa, perfilCtrl.verCandidato);

module.exports = router;
