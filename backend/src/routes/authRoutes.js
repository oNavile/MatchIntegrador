const express = require('express');
const router = express.Router();

const upload = require('../config/multer');
const authCtrl = require('../controllers/authController');

router.post('/cadastro/empresa',
  (req, _res, next) => { req.uploadFolder = 'logos'; next(); },
  upload.single('arquivo'),
  authCtrl.cadastrarEmpresa
);

router.post('/cadastro/candidato',
  (req, _res, next) => { req.uploadFolder = 'curriculos'; next(); },
  upload.single('arquivo'),
  authCtrl.cadastrarCandidato
);

router.post('/login', authCtrl.login);

module.exports = router;
