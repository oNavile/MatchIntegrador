const db = require('../config/database');

exports.listar = async (req, res) => {
  try {
    const [planos] = await db.query(
      'SELECT * FROM planos WHERE ativo = 1 ORDER BY preco_mensal ASC'
    );

    res.json({
      sucesso: true,
      dados: planos
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar planos'
    });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [planos] = await db.query(
      'SELECT * FROM planos WHERE id = ?',
      [id]
    );

    if (!planos.length) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Plano não encontrado'
      });
    }

    res.json({
      sucesso: true,
      dados: planos[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar plano'
    });
  }
};
