const db = require('../config/database');

exports.criarCandidatura = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { vaga_id } = req.body;

    const [candidato] = await db.execute(
      `SELECT id FROM candidatos WHERE usuario_id = ?`,
      [usuarioId]
    );

    if (!candidato.length) {
      return res.status(404).json({
        erro: 'Candidato não encontrado'
      });
    }

    const candidatoId = candidato[0].id;

    const [existente] = await db.execute(
      `SELECT id FROM candidaturas WHERE vaga_id = ? AND candidato_id = ?`,
      [vaga_id, candidatoId]
    );

    if (existente.length > 0) {
      return res.status(400).json({
        erro: 'Você já se candidatou para esta vaga'
      });
    }

    await db.execute(
      `INSERT INTO candidaturas (vaga_id, candidato_id, score_match, status)
       VALUES (?, ?, 0, 'pendente')`,
      [vaga_id, candidatoId]
    );

    return res.status(201).json({
      mensagem: 'Candidatura realizada com sucesso'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: 'Erro ao criar candidatura'
    });
  }
};