const express = require("express");
const router = express.Router();

const { autenticar } = require("../middlewares/auth");

const dashboardController = require("../controllers/dashboardController");

router.get(
    "/candidato",
    autenticar,
    dashboardController.getDashboardCandidato
);

router.get(
    "/empresa",
    autenticar,
    dashboardController.getDashboardEmpresa
);

router.get(
    "/admin",
    autenticar,
    dashboardController.getDashboardAdmin
);

module.exports = router;