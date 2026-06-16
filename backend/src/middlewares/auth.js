const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  try {
    console.log('AUTH HEADER:', req.headers.authorization);

    const authHeader = req.headers["authorization"];

    const token = authHeader?.replace(/Bearer\s/i, '');

    console.log('TOKEN:', token);

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log('PAYLOAD:', payload);

    req.usuario = payload;
    req.user = payload;

    next();

  } catch (err) {
    console.log("ERRO JWT:", err.message);

    return res.status(401).json({
      erro: "Token inválido"
    });
  }
};

const autorizar = (...tipos) => (req, res, next) => {
  if (!tipos.includes(req.usuario.tipo)) {
    return res.status(403).json({
      erro: 'Acesso negado para este perfil.'
    });
  }

  next();
};

const soAdmin = autorizar('admin');
const soEmpresa = autorizar('empresa');
const soCandidato = autorizar('candidato');
const adminOuEmpresa = autorizar('admin', 'empresa');

module.exports = {
  autenticar,
  autorizar,
  soAdmin,
  soEmpresa,
  soCandidato,
  adminOuEmpresa
};