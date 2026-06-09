const express = require("express");
const router = express.Router();

const { autenticar, soAdmin } = require("../middlewares/auth");

const usuariosController = require("../controllers/usuariosController");
const vagasController = require("../controllers/vagasController");
const dashboardController = require("../controllers/dashboardController");

router.get(
    "/usuarios",
    autenticar,
    soAdmin,
    usuariosController.listarUsuarios
);

router.put(
    "/usuarios/:id",
    autenticar,
    soAdmin,
    usuariosController.editarUsuario
);

router.delete(
    "/usuarios/:id",
    autenticar,
    soAdmin,
    usuariosController.excluirUsuario
);

router.get(
  "/vagas",
  autenticar,
  soAdmin,
  vagasController.listarTodasVagas
);

router.delete(
  "/vagas/:id",
  autenticar,
  soAdmin,
  vagasController.excluirVaga
);

router.get(
    "/relatorios",
    autenticar,
    soAdmin,
    dashboardController.getRelatorios
);

module.exports = router;