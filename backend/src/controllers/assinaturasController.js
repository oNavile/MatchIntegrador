const db = require('../config/database');

exports.criar = async (req, res) => {
  try {
    const { empresa_id, plano_id } = req.body;

    const dataInicio = new Date();

    const dataVencimento = new Date();
    dataVencimento.setMonth(dataVencimento.getMonth() + 1);

    const [existe] = await db.query(
      'SELECT * FROM assinaturas WHERE empresa_id = ?',
      [empresa_id]
    );

    if (existe.length) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Empresa já possui assinatura'
      });
    }

    const [resultado] = await db.query(
      `INSERT INTO assinaturas
      (empresa_id, plano_id, status, data_inicio, data_vencimento)
      VALUES (?, ?, 'ativa', ?, ?)`,
      [empresa_id, plano_id, dataInicio, dataVencimento]
    );

    res.status(201).json({
      sucesso: true,
      mensagem: 'Assinatura criada com sucesso',
      assinatura_id: resultado.insertId
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar assinatura'
    });
  }
};

exports.buscarPorEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const [dados] = await db.query(
      `SELECT 
        a.*,
        p.nome AS plano_nome,
        p.preco_mensal,
        p.limite_funcionarios
      FROM assinaturas a
      INNER JOIN planos p ON p.id = a.plano_id
      WHERE a.empresa_id = ?`,
      [empresaId]
    );

    if (!dados.length) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Assinatura não encontrada'
      });
    }

    res.json({
      sucesso: true,
      dados: dados[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar assinatura'
    });
  }
};

exports.cancelar = async (req, res) => {
  try {
    const { empresaId } = req.params;

    await db.query(
      `UPDATE assinaturas
       SET status = 'cancelada'
       WHERE empresa_id = ?`,
      [empresaId]
    );

    res.json({
      sucesso: true,
      mensagem: 'Assinatura cancelada'
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao cancelar assinatura'
    });
  }
};
