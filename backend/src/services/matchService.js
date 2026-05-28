const db = require('../config/database');

const calcularMatch = async (candidatoId, vagaId) => {

  const [pcCandidato] = await db.execute(
    `SELECT LOWER(palavra) AS palavra
     FROM palavras_chave
     WHERE entidade_tipo = 'candidato' AND entidade_id = ?`,
    [candidatoId]
  );

  
  const [pcVaga] = await db.execute(
    `SELECT LOWER(palavra) AS palavra
     FROM palavras_chave
     WHERE entidade_tipo = 'vaga' AND entidade_id = ?`,
    [vagaId]
  );

  if (!pcVaga.length) return 0;

  const palavrasCandidato = new Set(pcCandidato.map(r => r.palavra));
  const palavrasVaga      = pcVaga.map(r => r.palavra);

  const coincidencias = palavrasVaga.filter(p => palavrasCandidato.has(p)).length;
  const score         = Math.round((coincidencias / palavrasVaga.length) * 100);

  return score;
};


const rankingCandidatosPorVaga = async (vagaId) => {
  const [candidaturas] = await db.execute(
    `SELECT c.id AS candidatura_id,
            cand.id AS candidato_id,
            cand.nome,
            cand.email,
            cand.arquivo AS curriculo,
            c.score_match,
            c.status
     FROM candidaturas c
     JOIN candidatos cand ON cand.id = c.candidato_id
     WHERE c.vaga_id = ?
     ORDER BY c.score_match DESC`,
    [vagaId]
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
