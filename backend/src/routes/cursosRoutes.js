const express = require('express');
const router = express.Router();

const cursoController =
  require('../controllers/cursoController');

const {
  autenticar
} = require('../middlewares/auth');

const verificarAcessoCurso =
  require('../middlewares/verificarAcessoCurso');

router.get(
  '/',
  cursoController.listarCursos
);

router.get(
  '/meus-cursos',
  autenticar,
  cursoController.meusCursos
);

router.get(
  '/:id',
  cursoController.buscarCurso
);

router.post(
  '/:id/comprar',
  autenticar,
  cursoController.comprarCurso
);

router.post(
  '/comprar-plano',
  autenticar,
  cursoController.comprarPlano
);

router.get(
  '/:id/videos',
  autenticar,
  verificarAcessoCurso,
  cursoController.listarVideos
);

router.post(
  '/:id/videos/:videoId/concluir',
  autenticar,
  verificarAcessoCurso,
  cursoController.concluirVideo
);

router.get(
  '/:id/progresso',
  autenticar,
  verificarAcessoCurso,
  cursoController.progresso
);

module.exports = router;