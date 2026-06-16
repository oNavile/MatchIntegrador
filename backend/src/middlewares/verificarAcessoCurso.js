const db = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    const { id: cursoId } = req.params;

    if (
      req.usuario.tipo === 'empresa' ||
      req.usuario.tipo === 'admin'
    ) {
      return next();
    }

    const [candidatos] = await db.query(
      `
      SELECT id
      FROM candidatos
      WHERE usuario_id = ?
      `,
      [req.usuario.id]
    );

    if (!candidatos.length) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Candidato não encontrado'
      });
    }

    const candidatoId = candidatos[0].id;

    const [compras] = await db.query(
      `
      SELECT id
      FROM compras_cursos
      WHERE candidato_id = ?
      AND (
          curso_id = ?
          OR tipo = 'plano_completo'
      )
      AND status = 'aprovado'
      `,
      [candidatoId, cursoId]
    );

    if (!compras.length) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Curso não adquirido'
      });
    }

    next();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao validar acesso ao curso'
    });
  }
};