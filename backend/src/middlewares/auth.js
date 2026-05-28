
const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido. Faça login.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario   = payload; // { id, tipo }
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

const autorizar = (...tipos) => (req, res, next) => {
  if (!tipos.includes(req.usuario.tipo)) {
    return res.status(403).json({ erro: 'Acesso negado para este perfil.' });
  }
  next();
};

// Atalhos prontos para uso nas rotas
const soAdmin       = autorizar('admin');
const soEmpresa     = autorizar('empresa');
const soCandidato   = autorizar('candidato');
const adminOuEmpresa = autorizar('admin', 'empresa');

module.exports = { autenticar, autorizar, soAdmin, soEmpresa, soCandidato, adminOuEmpresa };
