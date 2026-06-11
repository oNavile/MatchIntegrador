const db = require('../config/database');

const calcularMatch = async (candidatoId, vagaId) => {

  const [[candidato]] = await db.execute(
    `SELECT tags_perfil
     FROM candidatos
     WHERE id = ?`,
    [candidatoId]
  );

  const [[vaga]] = await db.execute(
    `SELECT tags_vaga
     FROM vagas
     WHERE id = ?`,
    [vagaId]
  );

  if (!candidato?.tags_perfil || !vaga?.tags_vaga) {
    return 0;
  }

  const normalizar = (tag) =>
    tag
      .toLowerCase()
      .trim()
      .replace('.js', '')
      .replace('.', '')
      .replace(/\s+/g, ' ');

  const tagsCandidato = candidato.tags_perfil
    .split(',')
    .map(normalizar)
    .filter(Boolean);

  const tagsVaga = vaga.tags_vaga
    .split(',')
    .map(normalizar)
    .filter(Boolean);

  const coincidencias = tagsVaga.filter(tag =>
    tagsCandidato.includes(tag)
  );

  return Math.round(
    (coincidencias.length / tagsVaga.length) * 100
  );
};


const rankingCandidatosPorVaga = async (vagaId) => {
  const [candidaturas] = await db.execute(
    `SELECT
        c.id AS candidatura_id,
        cand.id AS candidato_id,
        cand.nome AS candidato_nome,
        cand.email AS candidato_email,
        cand.arquivo AS curriculo,
        c.score_match,
        c.status
     FROM candidaturas c
     JOIN candidatos cand
        ON cand.id = c.candidato_id
     WHERE c.vaga_id = ?
AND cand.id NOT IN (
    SELECT candidato_id
    FROM candidatos_rejeitados
    WHERE vaga_id = ?
)
ORDER BY c.score_match DESC`,
    [vagaId, vagaId]
  );

  return candidaturas;
};

const salvarMatch = async (candidaturaId, candidatoId, vagaId) => {
  const score = await calcularMatch(candidatoId, vagaId);
  await db.execute(
    `UPDATE candidaturas SET score_match = ? WHERE id = ?`,
    [score, candidaturaId]
  );
  return score;
};

module.exports = { calcularMatch, rankingCandidatosPorVaga, salvarMatch };
