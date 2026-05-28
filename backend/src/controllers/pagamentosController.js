const db = require('../config/database');

exports.criar = async (req, res) => {
  try {
    const {
      empresa_id,
      assinatura_id,
      plano_id,
      valor,
      metodo
    } = req.body;

    const [resultado] = await db.query(
      `INSERT INTO pagamentos
      (
        empresa_id,
        assinatura_id,
        plano_id,
        valor,
        metodo,
        status
      )
      VALUES (?, ?, ?, ?, ?, 'aprovado')`,
      [
        empresa_id,
        assinatura_id,
        plano_id,
        valor,
        metodo
      ]
    );

    res.status(201).json({
      sucesso: true,
      mensagem: 'Pagamento registrado com sucesso',
      pagamento_id: resultado.insertId
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao registrar pagamento'
    });
  }
};

exports.listarPorEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const [dados] = await db.query(
      `SELECT 
        pg.*,
        p.nome AS plano_nome
      FROM pagamentos pg
      INNER JOIN planos p ON p.id = pg.plano_id
      WHERE pg.empresa_id = ?
      ORDER BY pg.criado_em DESC`,
      [empresaId]
    );

    res.json({
      sucesso: true,
      dados
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar pagamentos'
    });
  }
};
