const express = require('express');
const router = express.Router();
const multerLib = require('multer'); // 🔥 IMPORTANTE: Importando a biblioteca para checar os erros

const upload = require('../config/multer'); // Seu arquivo de configuração customizado
const authCtrl = require('../controllers/authController');

// Rota de Empresa (Mantida original)
router.post('/cadastro/empresa',
  (req, _res, next) => { req.uploadFolder = 'logos'; next(); },
  upload.single('arquivo'),
  authCtrl.cadastrarEmpresa
);

// Rota de Candidato (CORRIGIDA)
router.post('/cadastro/candidato',
  (req, res, next) => {
    // Definimos que, por padrão, os arquivos dessa requisição vão para a pasta 'curriculos'
    req.uploadFolder = 'curriculos';

    // Executa o middleware de multiplos campos do seu upload instanciado
    upload.fields([
      { name: 'foto_perfil', maxCount: 1 },
      { name: 'curriculo', maxCount: 1 }
    ])(req, res, function (err) {
      if (err instanceof multerLib.MulterError) {
        console.error("❌ Erro específico do Multer:", err.message, err.field);
        return res.status(400).json({ erro: `Erro no upload do arquivo: ${err.message} (Campo: ${err.field})` });
      } else if (err) {
        console.error("❌ Erro desconhecido no upload:", err);
        return res.status(500).json({ erro: err.message });
      }
      // Sem erros! Segue para o Controller
      next();
    });
  },
  authCtrl.cadastrarCandidato
);

router.post('/login', authCtrl.login);

module.exports = router;