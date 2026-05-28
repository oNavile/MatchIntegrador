// src/controllers/vagasController.js
const db           = require('../config/database');
const matchService = require('../services/matchService');

// ── Listar vagas abertas ─────────────────────────────────────
const listarVagas = async (req, res) => {
  try {
    const { empresa_id, status = 'aberta', busca } = req.query;

    let sql = `
      SELECT v.*, e.nome AS empresa_nome, e.arquivo AS empresa_logo,
             c.nome AS cargo_nome, s.nome AS setor_nome
      FROM vagas v
      JOIN empresas e ON e.id = v.empresa_id
      LEFT JOIN cargos  c ON c.id = v.cargo_id
      LEFT JOIN setores s ON s.id = v.setor_id
      WHERE v.status = ?`;
    const params = [status];

    if (empresa_id) { sql += ` AND v.empresa_id = ?`; params.push(empresa_id); }
    if (busca)      { sql += ` AND (v.titulo LIKE ? OR v.descricao LIKE ?)`; params.push(`%${busca}%`, `%${busca}%`); }

    sql += ` ORDER BY v.criado_em DESC`;

    const [vagas] = await db.execute(sql, params);

    // Adiciona palavras-chave de cada vaga
    for (const vaga of vagas) {
      const [pcs] = await db.execute(
        `SELECT palavra FROM palavras_chave WHERE entidade_tipo = 'vaga' AND entidade_id = ?`,
        [vaga.id]
      );
      vaga.palavras_chave = pcs.map(p => p.palavra);
    }

    res.json(vagas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar vagas.' });
  }
};

// ── Detalhe de uma vaga ──────────────────────────────────────
const detalheVaga = async (req, res) => {
  try {
    const { id } = req.params;
    const [[vaga]] = await db.execute(
      `SELECT v.*, e.nome AS empresa_nome, e.descricao AS empresa_descricao,
              e.arquivo AS empresa_logo, c.nome AS cargo_nome, s.nome AS setor_nome
       FROM vagas v
       JOIN empresas e ON e.id = v.empresa_id
       LEFT JOIN cargos  c ON c.id = v.cargo_id
       LEFT JOIN setores s ON s.id = v.setor_id
       WHERE v.id = ?`,
      [id]
    );
    if (!vaga) return res.status(404).json({ erro: 'Vaga não encontrada.' });

    const [pcs] = await db.execute(
      `SELECT palavra FROM palavras_chave WHERE entidade_tipo = 'vaga' AND entidade_id = ?`,
      [id]
    );
    vaga.palavras_chave = pcs.map(p => p.palavra);

    res.json(vaga);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar vaga.' });
  }
};

// ── Criar vaga (empresa/admin) ───────────────────────────────
const criarVaga = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { titulo, descricao, requisitos, local, tipo,
            salario, cargo_id, setor_id, palavras_chave } = req.body;

    if (!titulo) return res.status(400).json({ erro: 'Título é obrigatório.' });

    // Descobre empresa_id a partir do usuário logado
    let empresaId;
    if (req.usuario.tipo === 'empresa') {
      const [[e]] = await conn.execute(
        `SELECT id FROM empresas WHERE usuario_id = ?`, [req.usuario.id]
      );
      if (!e) return res.status(403).json({ erro: 'Empresa não encontrada.' });
      empresaId = e.id;
    } else {
      // admin pode passar empresa_id no body
      empresaId = req.body.empresa_id;
      if (!empresaId) return res.status(400).json({ erro: 'empresa_id é obrigatório para admin.' });
    }

    const [res_] = await conn.execute(
      `INSERT INTO vagas (empresa_id, cargo_id, setor_id, titulo, descricao,
        requisitos, local, tipo, salario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [empresaId, cargo_id || null, setor_id || null, titulo, descricao,
       requisitos, local, tipo || 'presencial', salario || null]
    );
    const vagaId = res_.insertId;

    const pcs = Array.isArray(palavras_chave) ? palavras_chave : JSON.parse(palavras_chave || '[]');
    for (const palavra of pcs.slice(0, 4)) {
      if (palavra && palavra.trim()) {
        await conn.execute(
          `INSERT INTO palavras_chave (entidade_tipo, entidade_id, palavra) VALUES ('vaga', ?, ?)`,
          [vagaId, palavra.trim().toLowerCase()]
        );
      }
    }

    await conn.commit();
    res.status(201).json({ mensagem: 'Vaga criada com sucesso!', vaga_id: vagaId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar vaga.' });
  } finally {
    conn.release();
  }
};

// ── Atualizar status da vaga ─────────────────────────────────
const atualizarVaga = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, titulo, descricao, requisitos, local, tipo, salario } = req.body;

    await db.execute(
      `UPDATE vagas SET
        status    = COALESCE(?, status),
        titulo    = COALESCE(?, titulo),
        descricao = COALESCE(?, descricao),
        requisitos= COALESCE(?, requisitos),
        local     = COALESCE(?, local),
        tipo      = COALESCE(?, tipo),
        salario   = COALESCE(?, salario)
       WHERE id = ?`,
      [status || null, titulo || null, descricao || null, requisitos || null, local || null, tipo || null, salario || null, id]
    );
    res.json({ mensagem: 'Vaga atualizada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar vaga.' });
  }
};

// ── Candidatar-se a uma vaga ─────────────────────────────────
const candidatar = async (req, res) => {
  try {
    const { vaga_id } = req.body;

    const [[candidato]] = await db.execute(
      `SELECT id FROM candidatos WHERE usuario_id = ?`, [req.usuario.id]
    );
    if (!candidato) return res.status(403).json({ erro: 'Perfil de candidato não encontrado.' });

    // Verifica se já se candidatou
    const [[jaExiste]] = await db.execute(
      `SELECT id FROM candidaturas WHERE vaga_id = ? AND candidato_id = ?`,
      [vaga_id, candidato.id]
    );
    if (jaExiste) return res.status(409).json({ erro: 'Você já se candidatou a esta vaga.' });

    // Calcula score de match
    const score = await matchService.calcularMatch(candidato.id, vaga_id);

    const [result] = await db.execute(
      `INSERT INTO candidaturas (vaga_id, candidato_id, score_match) VALUES (?, ?, ?)`,
      [vaga_id, candidato.id, score]
    );

    res.status(201).json({
      mensagem: 'Candidatura realizada com sucesso!',
      candidatura_id: result.insertId,
      score_match: score
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao realizar candidatura.' });
  }
};

// ── Ranking de candidatos por vaga ───────────────────────────
const rankingCandidatos = async (req, res) => {
  try {
    const { vaga_id } = req.params;
    const ranking = await matchService.rankingCandidatosPorVaga(vaga_id);
    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar ranking.' });
  }
};

module.exports = { listarVagas, detalheVaga, criarVaga, atualizarVaga, candidatar, rankingCandidatos };