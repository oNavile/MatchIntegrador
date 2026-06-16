const db = require("../config/database");

module.exports = async (req, res, next) => {
  try {
    const { id: cursoId } = req.params;

    if (req.usuario.tipo === "admin") {
      return next();
    }

    let compradorId;
    let campoBanco;

    if (req.usuario.tipo === "candidato") {

      const [[candidato]] = await db.query(
        `
        SELECT id
        FROM candidatos
        WHERE usuario_id = ?
        `,
        [req.usuario.id]
      );

      if (!candidato) {
        return res.status(403).json({
          sucesso: false,
          mensagem: "Candidato não encontrado"
        });
      }

      compradorId = candidato.id;
      campoBanco = "candidato_id";

    } else if (req.usuario.tipo === "empresa") {

      const [[empresa]] = await db.query(
        `
        SELECT id
        FROM empresas
        WHERE usuario_id = ?
        `,
        [req.usuario.id]
      );

      if (!empresa) {
        return res.status(403).json({
          sucesso: false,
          mensagem: "Empresa não encontrada"
        });
      }

      compradorId = empresa.id;
      campoBanco = "empresa_id";

    } else {

      return res.status(403).json({
        sucesso: false,
        mensagem: "Usuário sem permissão"
      });

    }

    const [compras] = await db.query(
  `
  SELECT id
  FROM compras_cursos
  WHERE ${campoBanco} = ?
  AND (
      curso_id = ?
      OR (
          tipo = 'plano_completo'
          AND ? = 'candidato'
      )
  )
  AND status = 'aprovado'
  `,
  [
    compradorId,
    cursoId,
    req.usuario.tipo
  ]
);

    if (!compras.length) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Curso não adquirido"
      });
    }

    next();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao validar acesso ao curso"
    });
  }
};