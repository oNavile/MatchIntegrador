const db           = require('../config/database');
const matchService = require('../services/matchService');

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

    for (const vaga of vagas) {
      let tagsArray = [];

      if (typeof vaga.tags_vaga === 'string' && vaga.tags_vaga.trim() !== "") {
        tagsArray = vaga.tags_vaga.split(',').map(tag => tag.trim());
      } else if (Array.isArray(vaga.tags_vaga)) {
        tagsArray = vaga.tags_vaga;
      }

      vaga.tags_vaga = tagsArray;
      vaga.palavras_chave = tagsArray; 
    }

    res.json(vagas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar vagas.' });
  }
};

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

const criarVaga = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { titulo, descricao, requisitos, local, tipo,
            salario, cargo_id, setor_id, palavras_chave } = req.body;

    if (!titulo) return res.status(400).json({ erro: 'Título é obrigatório.' });

    let empresaId;
    if (req.usuario.tipo === 'empresa') {
      const [[e]] = await conn.execute(
        `SELECT id FROM empresas WHERE usuario_id = ?`, [req.usuario.id]
      );
      if (!e) return res.status(403).json({ erro: 'Empresa não encontrada.' });
      empresaId = e.id;
    } else {
      empresaId = req.body.empresa_id;
      if (!empresaId) return res.status(400).json({ erro: 'empresa_id é obrigatório para admin.' });
    }

    let pcs = [];
    if (Array.isArray(palavras_chave)) {
      pcs = palavras_chave;
    } else if (typeof palavras_chave === 'string') {
      try {
        pcs = JSON.parse(palavras_chave);
      } catch (e) {
        pcs = palavras_chave.split(',').map(p => p.trim());
      }
    }

const tagsVagaTexto = pcs.filter(p => p && p.trim()).join(', ');

const [res_] = await conn.execute(
  `INSERT INTO vagas (empresa_id, cargo_id, setor_id, titulo, descricao,
    requisitos, local, tipo, salario, tags_vaga)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    empresaId, 
    cargo_id || null, 
    setor_id || null, 
    titulo, 
    descricao,
    requisitos, 
    local, 
    tipo || 'presencial', 
    salario || null,
    tagsVagaTexto
  ]
);
    const vagaId = res_.insertId;

    await conn.commit();
    res.status(201).json({ mensagem: 'Vaga criada com sucesso!', vaga_id: vagaId });
  } catch (err) {
    await conn.rollback();
    console.error("Erro completo ao criar vaga:", err);
    res.status(500).json({ erro: 'Erro ao criar vaga.' });
  } finally {
    conn.release();
  }
};

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

const candidatar = async (req, res) => {
  try {
    const { vaga_id } = req.body;

    const [[candidato]] = await db.execute(
      `SELECT id FROM candidatos WHERE usuario_id = ?`, [req.usuario.id]
    );
    if (!candidato) return res.status(403).json({ erro: 'Perfil de candidato não encontrado.' });

    const [[jaExiste]] = await db.execute(
      `SELECT id FROM candidaturas WHERE vaga_id = ? AND candidato_id = ?`,
      [vaga_id, candidato.id]
    );
    if (jaExiste) return res.status(409).json({ erro: 'Você já se candidatou a esta vaga.' });

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

const listarTodasVagas = async (req, res) => {
  try {
    const [vagas] = await db.execute(`
      SELECT
        v.id,
        v.titulo,
        v.tipo,
        v.status,
        v.salario,
        v.criado_em,
        e.nome AS empresa_nome
      FROM vagas v
      INNER JOIN empresas e
        ON e.id = v.empresa_id
      ORDER BY v.id DESC
    `);

    res.json(vagas);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      erro: "Erro ao listar vagas"
    });
  }
};

const excluirVaga = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      "DELETE FROM vagas WHERE id = ?",
      [id]
    );

    res.json({
      mensagem: "Vaga removida com sucesso"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      erro: "Erro ao excluir vaga"
    });
  }
};

const rejeitarCandidato = async (req, res) => {
  try {

    const { vaga_id, candidato_id } = req.body;

    await db.execute(
      `INSERT IGNORE INTO candidatos_rejeitados
       (vaga_id, candidato_id)
       VALUES (?, ?)`,
      [vaga_id, candidato_id]
    );

    res.json({
      mensagem: "Candidato rejeitado com sucesso"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: "Erro ao rejeitar candidato"
    });
  }
};

module.exports = { listarVagas, detalheVaga, criarVaga, atualizarVaga, candidatar, rankingCandidatos, listarTodasVagas, excluirVaga, rejeitarCandidato };