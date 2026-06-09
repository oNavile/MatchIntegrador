const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = authHeader?.replace("Bearer ", "");

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = payload;

    req.user = payload; // se quiser compatibilidade
    next();
  } catch (err) {
    console.log("ERRO JWT:", err.message);
    return res.status(401).json({ erro: "Token inválido" });
  }
};

const autorizar = (...tipos) => (req, res, next) => {
  if (!tipos.includes(req.usuario.tipo)) {
    return res.status(403).json({ erro: 'Acesso negado para este perfil.' });
  }
  next();
};

// Atalhos prontos para uso nas rotas
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
