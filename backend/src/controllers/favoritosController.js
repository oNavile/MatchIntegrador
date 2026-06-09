// src/controllers/favoritosController.js
const db = require('../config/database');

// ── Listar Favoritos ─────────────────────────────────────────
const listarFavoritos = async (req, res) => {
  try {
    // Garante que apenas candidatos tenham favoritos
    if (req.usuario.tipo !== 'candidato') {
      return res.status(403).json({ erro: 'Apenas candidatos podem ter favoritos.' });
    }

    // Busca o ID real do candidato atrelado ao usuário logado
    const [[candidato]] = await db.execute(
      `SELECT id FROM candidatos WHERE usuario_id = ?`, [req.usuario.id]
    );

    if (!candidato) {
      return res.status(404).json({ erro: 'Perfil de candidato não encontrado.' });
    }

    // Busca apenas os IDs das vagas favoritadas por ele
    const [rows] = await db.execute(
      'SELECT vaga_id FROM favoritos WHERE candidato_id = ?', 
      [candidato.id]
    );
    
    // Transforma o resultado num array simples: [1, 5, 12]
    const idsFavoritos = rows.map(row => row.vaga_id);
    res.json(idsFavoritos);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar favoritos.' });
  }
};

// ── Alternar Favorito (Adicionar/Remover) ────────────────────
const alternarFavorito = async (req, res) => {
  try {
    // Garante que apenas candidatos possam favoritar
    if (req.usuario.tipo !== 'candidato') {
      return res.status(403).json({ erro: 'Apenas candidatos podem favoritar vagas.' });
    }

    const { vaga_id } = req.body;

    if (!vaga_id) {
      return res.status(400).json({ erro: 'O ID da vaga é obrigatório.' });
    }

    // Busca o ID real do candidato atrelado ao usuário logado
    const [[candidato]] = await db.execute(
      `SELECT id FROM candidatos WHERE usuario_id = ?`, [req.usuario.id]
    );

    if (!candidato) {
      return res.status(404).json({ erro: 'Perfil de candidato não encontrado.' });
    }

    // Verifica se o favorito já existe no banco
    const [existe] = await db.execute(
      'SELECT id FROM favoritos WHERE candidato_id = ? AND vaga_id = ?',
      [candidato.id, vaga_id]
    );

    // Se já existe, remove. Se não existe, adiciona.
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