const db = require('../config/database');

exports.getMatchesPorCandidato = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [candidatoRows] = await db.query(
      `SELECT id, tags_perfil FROM candidatos WHERE usuario_id = ?`,
      [usuarioId]
    );

    if (!candidatoRows.length) {
      return res.status(404).json({ erro: 'Candidato não encontrado' });
    }

    const candidato = candidatoRows[0];

    if (!candidato.tags_perfil) {
      return res.json([]);
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

    const [vagas] = await db.query(
      `
SELECT
    v.id,
    v.titulo,
    v.tags_vaga,
    e.nome AS empresa
FROM vagas v
JOIN empresas e
    ON e.id = v.empresa_id
WHERE v.status = 'aberta'

AND v.id NOT IN (
    SELECT vaga_id
    FROM candidaturas
    WHERE candidato_id = ?
)

AND v.id NOT IN (
    SELECT vaga_id
    FROM vagas_recusadas
    WHERE candidato_id = ?
)
`,
      [candidato.id, candidato.id]
    );

    const matches = [];

    for (const vaga of vagas) {
      if (!vaga.tags_vaga) continue;

      const tagsVaga = vaga.tags_vaga
        .split(',')
        .map(normalizar)
        .filter(Boolean);

      const emComum = tagsVaga.filter(tag =>
        tagsCandidato.includes(tag)
      );

      if (emComum.length === 0) continue;

      const percentual = Math.round(
        (emComum.length / tagsVaga.length) * 100
      );

      matches.push({
        id: vaga.id,
        empresa: vaga.empresa,
        vaga: vaga.titulo,
        percentual,
        icone: 'bi-building',
        habilidades: emComum
      });
    }

    matches.sort((a, b) => b.percentual - a.percentual);

    return res.json(matches);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao calcular matches' });
  }
};

exports.recusarVaga = async (req, res) => {
  try {
    const { vaga_id } = req.body;

    const [[candidato]] = await db.query(
      `SELECT id FROM candidatos WHERE usuario_id = ?`,
      [req.usuario.id]
    );

    await db.query(
      `INSERT IGNORE INTO vagas_recusadas (vaga_id, candidato_id)
       VALUES (?, ?)`,
      [vaga_id, candidato.id]
    );

    res.json({
      mensagem: "Vaga recusada com sucesso"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Erro ao recusar vaga"
    });
  }
};