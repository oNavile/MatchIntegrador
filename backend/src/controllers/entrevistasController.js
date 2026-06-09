const db = require('../config/database');

const agendarEntrevista = async (req, res) => {
  try {
    const { candidatura_id, candidato_id, data_hora, tipo, link_ou_local, observacoes } = req.body;

    if (!candidatura_id || !candidato_id || !data_hora)
      return res.status(400).json({ erro: 'candidatura_id, candidato_id e data_hora são obrigatórios.' });

    const [[empresa]] = await db.execute(
      `SELECT id FROM empresas WHERE usuario_id = ?`, [req.usuario.id]
    );
    const empresaId = req.usuario.tipo === 'admin' ? req.body.empresa_id : empresa?.id;
    if (!empresaId) return res.status(403).json({ erro: 'Empresa não encontrada.' });

    const [result] = await db.execute(
      `INSERT INTO entrevistas
        (candidatura_id, empresa_id, candidato_id, data_hora, tipo, link_ou_local, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [candidatura_id, empresaId, candidato_id, data_hora,
       tipo || 'online', link_ou_local, observacoes]
    );

    res.status(201).json({
      mensagem: 'Entrevista agendada com sucesso!',
      entrevista_id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao agendar entrevista.' });
  }
};

const listarEntrevistas = async (req, res) => {
  try {
    let sql, params;

    if (req.usuario.tipo === 'empresa') {
      const [[e]] = await db.execute(
        `SELECT id FROM empresas WHERE usuario_id = ?`, [req.usuario.id]
      );
      sql    = `SELECT e.*, cand.nome AS candidato_nome, cand.email AS candidato_email
                FROM entrevistas e
                JOIN candidatos cand ON cand.id = e.candidato_id
                WHERE e.empresa_id = ? ORDER BY e.data_hora ASC`;
      params = [e.id];
    } else if (req.usuario.tipo === 'candidato') {
      const [[c]] = await db.execute(
        `SELECT id FROM candidatos WHERE usuario_id = ?`, [req.usuario.id]
      );
      sql    = `SELECT e.*, emp.nome AS empresa_nome
                FROM entrevistas e
                JOIN empresas emp ON emp.id = e.empresa_id
                WHERE e.candidato_id = ? ORDER BY e.data_hora ASC`;
      params = [c.id];
    } else {
      sql    = `SELECT e.*, cand.nome AS candidato_nome, emp.nome AS empresa_nome
                FROM entrevistas e
                JOIN candidatos cand ON cand.id = e.candidato_id
                JOIN empresas   emp  ON emp.id  = e.empresa_id
                ORDER BY e.data_hora ASC`;
      params = [];
    }

    const [entrevistas] = await db.execute(sql, params);
    res.json(entrevistas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar entrevistas.' });
  }
};

const atualizarEntrevista = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, data_hora, link_ou_local, observacoes } = req.body;

    await db.execute(
      `UPDATE entrevistas SET
        status       = COALESCE(?, status),
        data_hora    = COALESCE(?, data_hora),
        link_ou_local= COALESCE(?, link_ou_local),
        observacoes  = COALESCE(?, observacoes)
       WHERE id = ?`,
      [status || null, data_hora || null, link_ou_local || null, observacoes || null, id]
    );
    res.json({ mensagem: 'Entrevista atualizada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar entrevista.' });
  }
};

module.exports = { agendarEntrevista, listarEntrevistas, atualizarEntrevista };