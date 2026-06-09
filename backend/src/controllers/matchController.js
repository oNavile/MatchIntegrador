// src/controllers/matchController.js
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

    // 🔥 FUNÇÃO DE NORMALIZAÇÃO (ESSENCIAL)
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

    const [vagas] = await db.query(`
      SELECT v.id, v.titulo, v.tags_vaga, e.nome AS empresa
      FROM vagas v
      JOIN empresas e ON e.id = v.empresa_id
      WHERE v.status = 'aberta'
    `);

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