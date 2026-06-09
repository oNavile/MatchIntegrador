const express = require('express');
const router = express.Router();
const multerLib = require('multer');

const upload = require('../config/multer');
const authCtrl = require('../controllers/authController');

router.post('/cadastro/empresa',
  (req, _res, next) => { req.uploadFolder = 'logos'; next(); },
  upload.single('arquivo'),
  authCtrl.cadastrarEmpresa
);

router.post('/cadastro/candidato',
  (req, res, next) => {
    req.uploadFolder = 'curriculos';

    upload.fields([
      { name: 'foto_perfil', maxCount: 1 },
      { name: 'curriculo', maxCount: 1 }
    ])(req, res, function (err) {
      if (err instanceof multerLib.MulterError) {
        console.error("Erro específico do Multer:", err.message, err.field);
        return res.status(400).json({ erro: `Erro no upload do arquivo: ${err.message} (Campo: ${err.field})` });
      } else if (err) {
        console.error("Erro desconhecido no upload:", err);
        return res.status(500).json({ erro: err.message });
      }
      next();
    });
  },
  authCtrl.cadastrarCandidato
);

router.post('/login', authCtrl.login);

module.exports = router;