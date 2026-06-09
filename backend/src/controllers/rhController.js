const db = require('../config/database');

const getEmpresaId = async (usuario) => {
  if (usuario.tipo === 'admin') return null;
  const [[e]] = await db.execute(`SELECT id FROM empresas WHERE usuario_id = ?`, [usuario.id]);
  return e ? e.id : null;
};

const listarSetores = async (req, res) => {
  try {
    let empresaId = await getEmpresaId(req.usuario);
    if (req.usuario.tipo === 'admin') empresaId = req.query.empresa_id;

    const [setores] = await db.execute(
      `SELECT s.*, COUNT(c.id) AS total_cargos
       FROM setores s
       LEFT JOIN cargos c ON c.setor_id = s.id
       WHERE s.empresa_id = ?
       GROUP BY s.id
       ORDER BY s.nome`,
      [empresaId]
    );
    res.json(setores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar setores.' });
  }
};

const criarSetor = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });

    let empresaId = await getEmpresaId(req.usuario);
    if (req.usuario.tipo === 'admin') empresaId = req.body.empresa_id;

    const [result] = await db.execute(
      `INSERT INTO setores (empresa_id, nome, descricao) VALUES (?, ?, ?)`,
      [empresaId, nome, descricao]
    );
    res.status(201).json({ mensagem: 'Setor criado!', setor_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar setor.' });
  }
};

const editarSetor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    await db.execute(
      `UPDATE setores SET nome = COALESCE(?, nome), descricao = COALESCE(?, descricao) WHERE id = ?`,
      [nome, descricao, id]
    );
    res.json({ mensagem: 'Setor atualizado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao editar setor.' });
  }
};

const deletarSetor = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(`DELETE FROM setores WHERE id = ?`, [id]);
    res.json({ mensagem: 'Setor removido!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover setor.' });
  }
};

const listarCargos = async (req, res) => {
  try {
    let empresaId = await getEmpresaId(req.usuario);
    if (req.usuario.tipo === 'admin') empresaId = req.query.empresa_id;
    const { setor_id } = req.query;

    let sql = `
      SELECT c.*, s.nome AS setor_nome
      FROM cargos c
      LEFT JOIN setores s ON s.id = c.setor_id
      WHERE c.empresa_id = ?`;
    const params = [empresaId];

    if (setor_id) { sql += ` AND c.setor_id = ?`; params.push(setor_id); }
    sql += ` ORDER BY c.nome`;

    const [cargos] = await db.execute(sql, params);
    res.json(cargos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar cargos.' });
  }
};

const criarCargo = async (req, res) => {
  try {
    const { nome, descricao, salario, setor_id } = req.body;
    if (!nome || !setor_id) return res.status(400).json({ erro: 'Nome e setor_id são obrigatórios.' });

    let empresaId = await getEmpresaId(req.usuario);
    if (req.usuario.tipo === 'admin') empresaId = req.body.empresa_id;

    const [result] = await db.execute(
      `INSERT INTO cargos (setor_id, empresa_id, nome, descricao, salario) VALUES (?, ?, ?, ?, ?)`,
      [setor_id, empresaId, nome, descricao, salario || null]
    );
    res.status(201).json({ mensagem: 'Cargo criado!', cargo_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar cargo.' });
  }
};

const editarCargo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, salario, setor_id } = req.body;
    await db.execute(
      `UPDATE cargos SET
        nome     = COALESCE(?, nome),
        descricao= COALESCE(?, descricao),
        salario  = COALESCE(?, salario),
        setor_id = COALESCE(?, setor_id)
       WHERE id = ?`,
      [nome || null, descricao || null, salario || null, setor_id || null, id]
    );
    res.json({ mensagem: 'Cargo atualizado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao editar cargo.' });
  }
};

const deletarCargo = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(`DELETE FROM cargos WHERE id = ?`, [id]);
    res.json({ mensagem: 'Cargo removido!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover cargo.' });
  }
};

module.exports = {
  listarSetores, criarSetor, editarSetor, deletarSetor,
  listarCargos, criarCargo, editarCargo, deletarCargo
};