const db = require("../config/database");
const matchService = require('../services/matchService');

exports.criarCandidatura = async (req, res) => {
  try {

    console.log("ENTROU NO CRIAR CANDIDATURA");

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

    // calcular o match
    const score = await matchService.calcularMatch(
        candidatoId,
        vaga_id
    );

    console.log("SCORE:", score);

    const [result] = await db.execute(
  `INSERT INTO candidaturas (vaga_id, candidato_id, score_match, status)
   VALUES (?, ?, ?, 'pendente')`,
  [vaga_id, candidatoId, score]
);

console.log("ID da candidatura:", result.insertId);

const [[teste]] = await db.execute(
  `SELECT score_match
   FROM candidaturas
   WHERE id = ?`,
  [result.insertId]
);

console.log("SALVO NO BANCO:", teste.score_match);

    return res.status(201).json({
      mensagem: 'Candidatura realizada com sucesso',
      score_match: score
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: 'Erro ao criar candidatura'
    });
  }
};