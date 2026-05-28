const express = require('express');
const router = express.Router();

const { autenticar, soAdmin, adminOuEmpresa } = require('../middlewares/auth');
const dashCtrl = require('../controllers/dashboardController');

router.get('/admin', autenticar, soAdmin, dashCtrl.dashboardAdmin);
router.get('/empresa', autenticar, adminOuEmpresa, dashCtrl.dashboardEmpresa);
router.get('/candidato', autenticar, dashCtrl.dashboardCandidato);

module.exports = router;
