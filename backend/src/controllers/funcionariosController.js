const db = require('../config/database');


const getEmpresaId = async (usuario) => {
  if (usuario.tipo === 'admin') return null;
  const [[e]] = await db.execute(
    `SELECT id FROM empresas WHERE usuario_id = ?`, [usuario.id]
  );
  return e ? e.id : null;
};

const listarFuncionarios = async (req, res) => {
  try {
    const { status, empresa_id: empresaParam } = req.query;
    let empresaId = await getEmpresaId(req.usuario);
    if (req.usuario.tipo === 'admin') empresaId = empresaParam;
    if (!empresaId) return res.status(400).json({ erro: 'empresa_id é obrigatório.' });

    let sql = `
      SELECT f.id, f.data_admissao, f.data_demissao, f.status, f.motivo_saida,
             cand.nome, cand.email, cand.telefone, cand.arquivo AS curriculo,
             c.nome AS cargo, s.nome AS setor
      FROM funcionarios f
      JOIN candidatos cand ON cand.id = f.candidato_id
      LEFT JOIN cargos  c ON c.id = f.cargo_id
      LEFT JOIN setores s ON s.id = f.setor_id
      WHERE f.empresa_id = ?`;
    const params = [empresaId];

    if (status) { sql += ` AND f.status = ?`; params.push(status); }
    sql += ` ORDER BY cand.nome ASC`;

    const [funcionarios] = await db.execute(sql, params);
    res.json(funcionarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar funcionários.' });
  }
};


const detalheFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const [[f]] = await db.execute(
      `SELECT f.*, cand.nome, cand.email, cand.cpf, cand.telefone,
              cand.descricao, cand.arquivo AS curriculo,
              cand.cep, cand.rua, cand.numero, cand.bairro,
              c.nome AS cargo, s.nome AS setor
       FROM funcionarios f
       JOIN candidatos cand ON cand.id = f.candidato_id
       LEFT JOIN cargos  c ON c.id = f.cargo_id
       LEFT JOIN setores s ON s.id = f.setor_id
       WHERE f.id = ?`,
      [id]
    );
    if (!f) return res.status(404).json({ erro: 'Funcionário não encontrado.' });
    res.json(f);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar funcionário.' });
  }
};

const admitirFuncionario = async (req, res) => {
  
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { candidato_id, cargo_id, setor_id, data_admissao } = req.body;

    let empresaId = await getEmpresaId(req.usuario);
    if (req.usuario.tipo === 'admin') empresaId = req.body.empresa_id;
    if (!empresaId) return res.status(400).json({ erro: 'empresa_id é obrigatório.' });
    if (!candidato_id || !data_admissao)
      return res.status(400).json({ erro: 'candidato_id e data_admissao são obrigatórios.' });

    const [[jaAtivo]] = await conn.execute(
      `SELECT id FROM funcionarios WHERE empresa_id = ? AND candidato_id = ? AND status = 'ativo'`,
      [empresaId, candidato_id]
    );
    if (jaAtivo)
      return res.status(409).json({ erro: 'Candidato já é funcionário ativo desta empresa.' });

    const [resFuncionario] = await conn.execute(
      `INSERT INTO funcionarios (empresa_id, candidato_id, cargo_id, setor_id, data_admissao)
       VALUES (?, ?, ?, ?, ?)`,
      [empresaId, candidato_id, cargo_id || null, setor_id || null, data_admissao]
    );
    const funcionarioId = resFuncionario.insertId;

    await conn.execute(
      `INSERT INTO contratos (empresa_id, candidato_id, funcionario_id, data_inicio)
       VALUES (?, ?, ?, ?)`,
      [empresaId, candidato_id, funcionarioId, data_admissao]
    );

    await conn.commit();
    res.status(201).json({ mensagem: 'Funcionário admitido com sucesso!', funcionario_id: funcionarioId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ erro: 'Erro ao admitir funcionário.' });
  } finally {
    conn.release();
  }
};


const desligarFuncionario = async (req, res) => {

  console.log("CHEGOU NA FUNÇÃO DESLIGAR");
  console.log("ID:", req.params.id);
  console.log("BODY:", req.body);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { id } = req.params;
    const { motivo_saida, data_demissao } = req.body;
    const dataDemissao = data_demissao || new Date().toISOString().split('T')[0];

    await conn.execute(
      `UPDATE funcionarios
       SET status = 'inativo', data_demissao = ?, motivo_saida = ?
       WHERE id = ?`,
      [dataDemissao, motivo_saida || null, id]
    );

    await conn.execute(
      `UPDATE contratos SET status = 'encerrado', data_fim = ?
       WHERE funcionario_id = ? AND status = 'ativo'`,
      [dataDemissao, id]
    );

    await conn.commit();
    res.json({ mensagem: 'Funcionário desligado com sucesso.' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ erro: 'Erro ao desligar funcionário.' });
  } finally {
    conn.release();
  }
};

const atualizarFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const { cargo_id, setor_id } = req.body;

    await db.execute(
      `UPDATE funcionarios SET
        cargo_id = COALESCE(?, cargo_id),
        setor_id = COALESCE(?, setor_id)
       WHERE id = ?`,
      [cargo_id, setor_id, id]
    );
    res.json({ mensagem: 'Funcionário atualizado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar funcionário.' });
  }
};

const rankingFuncionarios = async (req, res) => {
  try {
    let empresaId = await getEmpresaId(req.usuario);
    if (req.usuario.tipo === 'admin') empresaId = req.query.empresa_id;

    const [ranking] = await db.execute(
      `SELECT f.id, cand.nome, c.nome AS cargo, s.nome AS setor,
              f.data_admissao,
              COALESCE(cand_ura.score_match, 0) AS score_match
       FROM funcionarios f
       JOIN candidatos cand ON cand.id = f.candidato_id
       LEFT JOIN cargos  c ON c.id = f.cargo_id
       LEFT JOIN setores s ON s.id = f.setor_id
       LEFT JOIN (
         SELECT candidato_id, MAX(score_match) AS score_match
         FROM candidaturas GROUP BY candidato_id
       ) cand_ura ON cand_ura.candidato_id = f.candidato_id
       WHERE f.empresa_id = ? AND f.status = 'ativo'
       ORDER BY score_match DESC`,
      [empresaId]
    );
    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar ranking de funcionários.' });
  }
};

module.exports = {
  listarFuncionarios, detalheFuncionario, admitirFuncionario,
  desligarFuncionario, atualizarFuncionario, rankingFuncionarios
};
