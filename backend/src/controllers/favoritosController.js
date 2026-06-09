const db = require('../config/database');

const listarFavoritos = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'candidato') {
      return res.status(403).json({ erro: 'Apenas candidatos podem ter favoritos.' });
    }

    const [[candidato]] = await db.execute(
      `SELECT id FROM candidatos WHERE usuario_id = ?`, [req.usuario.id]
    );

    if (!candidato) {
      return res.status(404).json({ erro: 'Perfil de candidato não encontrado.' });
    }

    const [rows] = await db.execute(
      'SELECT vaga_id FROM favoritos WHERE candidato_id = ?', 
      [candidato.id]
    );
    
    const idsFavoritos = rows.map(row => row.vaga_id);
    res.json(idsFavoritos);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar favoritos.' });
  }
};

const alternarFavorito = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'candidato') {
      return res.status(403).json({ erro: 'Apenas candidatos podem favoritar vagas.' });
    }

    const { vaga_id } = req.body;

    if (!vaga_id) {
      return res.status(400).json({ erro: 'O ID da vaga é obrigatório.' });
    }

    const [[candidato]] = await db.execute(
      `SELECT id FROM candidatos WHERE usuario_id = ?`, [req.usuario.id]
    );

    if (!candidato) {
      return res.status(404).json({ erro: 'Perfil de candidato não encontrado.' });
    }

    const [existe] = await db.execute(
      'SELECT id FROM favoritos WHERE candidato_id = ? AND vaga_id = ?',
      [candidato.id, vaga_id]
    );

    if (existe.length > 0) {
      await db.execute(
        'DELETE FROM favoritos WHERE candidato_id = ? AND vaga_id = ?', 
        [candidato.id, vaga_id]
      );
      return res.json({ acao: 'removido' });
    } else {
      await db.execute(
        'INSERT INTO favoritos (candidato_id, vaga_id) VALUES (?, ?)', 
        [candidato.id, vaga_id]
      );
      return res.json({ acao: 'adicionado' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao alternar favorito.' });
  }
};

module.exports = { listarFavoritos, alternarFavorito };