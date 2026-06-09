// src/controllers/perfilController.js
const db = require('../config/database');

// ── Ver perfil próprio ───────────────────────────────────────
const meuPerfil = async (req, res) => {
  try {
    const { id, tipo } = req.usuario;
    let perfil;

    if (tipo === 'empresa') {
      const [[e]] = await db.execute(
        `SELECT e.*, GROUP_CONCAT(pc.palavra) AS palavras_chave
         FROM empresas e
         LEFT JOIN palavras_chave pc ON pc.entidade_tipo = 'empresa' AND pc.entidade_id = e.id
         WHERE e.usuario_id = ?
         GROUP BY e.id`,
        [id]
      );
      perfil = e;
      if (perfil) perfil.palavras_chave = perfil.palavras_chave ? perfil.palavras_chave.split(',') : [];

    } else if (tipo === 'candidato') {
      const [[c]] = await db.execute(
        `SELECT c.*, GROUP_CONCAT(pc.palavra) AS palavras_chave
         FROM candidatos c
         LEFT JOIN palavras_chave pc ON pc.entidade_tipo = 'candidato' AND pc.entidade_id = c.id
         WHERE c.usuario_id = ?
         GROUP BY c.id`,
        [id]
      );
      perfil = c;
      if (perfil) perfil.palavras_chave = perfil.palavras_chave ? perfil.palavras_chave.split(',') : [];

    } else {
      const [[a]] = await db.execute(
        `SELECT a.* FROM admins a WHERE a.usuario_id = ?`,
        [id]
      );
      perfil = a;
    }

    if (!perfil) return res.status(404).json({ erro: 'Perfil não encontrado.' });
    res.json({ tipo, ...perfil });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar perfil.' });
  }
};

// ── Editar perfil próprio ────────────────────────────────────
const editarPerfil = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { id, tipo } = req.usuario;
    const arquivo = req.file ? req.file.filename : null;

    if (tipo === 'empresa') {
      const {
        nome,
        email,
        descricao,
        telefone,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        palavras_chave
      } = req.body;

      const [[e]] = await conn.execute(
        `SELECT id, usuario_id FROM empresas WHERE usuario_id = ?`,
        [id]
      );

      if (!e) return res.status(404).json({ erro: 'Empresa não encontrada.' });

      // Valida e-mail duplicado para empresa
      if (email) {
        const [[emailExiste]] = await conn.execute(
          `SELECT id FROM usuarios WHERE email = ? AND id <> ?`,
          [email, id]
        );

        if (emailExiste) {
          return res.status(409).json({ erro: 'E-mail já cadastrado.' });
        }

        await conn.execute(
          `UPDATE usuarios SET email = ? WHERE id = ?`,
          [email, id]
        );
      }
      const cidadeFinal = Array.isArray(cidade)
        ? cidade[0]
        : cidade;

      const estadoFinal = Array.isArray(estado)
        ? estado[0]
        : estado;
      await conn.execute(
  `UPDATE empresas SET
    nome      = COALESCE(?, nome),
    email     = COALESCE(?, email),
    descricao = COALESCE(?, descricao),
    telefone  = COALESCE(?, telefone),
    cep       = COALESCE(?, cep),
    rua       = COALESCE(?, rua),
    numero    = COALESCE(?, numero),
    bairro    = COALESCE(?, bairro),
    cidade    = COALESCE(?, cidade),
    estado    = COALESCE(?, estado),
    arquivo   = COALESCE(?, arquivo)
   WHERE id = ?`,
  [
    nome || null,
    email || null,
    descricao || null,
    telefone || null,
    cep || null,
    rua || null,
    numero || null,
    bairro || null,
    cidadeFinal || null,
    estadoFinal || null,
    arquivo || null,
    e.id
  ]
);

      // Salva até 8 competências/palavras-chave da empresa
      if (palavras_chave) {
        const pcs = Array.isArray(palavras_chave) ? palavras_chave : JSON.parse(palavras_chave);

        await conn.execute(
          `DELETE FROM palavras_chave WHERE entidade_tipo = 'empresa' AND entidade_id = ?`,
          [e.id]
        );

        for (const p of pcs.slice(0, 8)) { // Mudado de 4 para 8
          if (p && p.trim()) {
            await conn.execute(
              `INSERT INTO palavras_chave (entidade_tipo, entidade_id, palavra) VALUES ('empresa', ?, ?)`,
              [e.id, p.trim().toLowerCase()]
            );
          }
        }
      }

    } else if (tipo === 'candidato') {
      // Capturando os dados enviados pelo seu form reativo do React
      const {
        nome,
        email,        // Adicionado para sincronizar com o input do front
        idade,
        telefone,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        descricao,
        palavras_chave
      } = req.body;

      const [[c]] = await conn.execute(
        `SELECT id FROM candidatos WHERE usuario_id = ?`,
        [id]
      );

      if (!c) return res.status(404).json({ erro: 'Candidato não encontrado.' });

      // NOVO: Valida e atualiza o e-mail global do usuário candidato
      if (email) {
        const [[emailExiste]] = await conn.execute(
          `SELECT id FROM usuarios WHERE email = ? AND id <> ?`,
          [email, id]
        );

        if (emailExiste) {
          return res.status(409).json({ erro: 'E-mail já cadastrado.' });
        }

        await conn.execute(
          `UPDATE usuarios SET email = ? WHERE id = ?`,
          [email, id]
        );
      }

      // Executa a atualização com tratamento de nulos/antigos
      await conn.execute(
        `UPDATE candidatos SET
          nome       = COALESCE(?, nome),
          email      = COALESCE(?, email),
          idade      = COALESCE(?, idade),
          telefone   = COALESCE(?, telefone),
          cep        = COALESCE(?, cep),
          rua        = COALESCE(?, rua),
          numero     = COALESCE(?, numero),
          bairro     = COALESCE(?, bairro),
          cidade     = COALESCE(?, cidade),
          estado     = COALESCE(?, estado),
          descricao  = COALESCE(?, descricao),
          arquivo    = COALESCE(?, arquivo)
         WHERE id = ?`,
        [
          nome || null,
          email || null,
          idade || null,
          telefone || null,
          cep || null,
          rua || null,
          numero || null,
          bairro || null,
          cidade || null,
          estado || null,
          descricao || null,
          arquivo || null,
          c.id
        ]
      );

      // Salva até 8 competências do candidato (Sincronizado com os 8 do React)
      if (palavras_chave) {
        const pcs = Array.isArray(palavras_chave) ? palavras_chave : JSON.parse(palavras_chave);

        await conn.execute(
          `DELETE FROM palavras_chave WHERE entidade_tipo = 'candidato' AND entidade_id = ?`,
          [c.id]
        );

        for (const p of pcs.slice(0, 8)) { // Mudado de 4 para 8 para bater com o front
          if (p && p.trim()) {
            await conn.execute(
              `INSERT INTO palavras_chave (entidade_tipo, entidade_id, palavra) VALUES ('candidato', ?, ?)`,
              [c.id, p.trim().toLowerCase()]
            );
          }
        }
      }
    }

    await conn.commit();
    res.json({ mensagem: 'Perfil updated com sucesso!' });

  } catch (err) {
    await conn.rollback();

    console.error("ERRO COMPLETO:", err);

    res.status(500).json({
      erro: err.message,
      sqlMessage: err.sqlMessage,
      code: err.code
    });
  } finally {
    conn.release();
  }
};

// ── Ver perfil de candidato (empresa/admin) ──────────────────
const verCandidato = async (req, res) => {
  try {
    const { id } = req.params;

    const [[c]] = await db.execute(
      `SELECT c.nome, c.email, c.idade, c.telefone, c.descricao, c.arquivo,
              c.cep, c.rua, c.numero, c.bairro, c.cidade, c.estado,
              GROUP_CONCAT(pc.palavra) AS palavras_chave
       FROM candidatos c
       LEFT JOIN palavras_chave pc ON pc.entidade_tipo = 'candidato' AND pc.entidade_id = c.id
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    );

    if (!c) return res.status(404).json({ erro: 'Candidato não encontrado.' });

    c.palavras_chave = c.palavras_chave ? c.palavras_chave.split(',') : [];
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar candidato.' });
  }
};

module.exports = {
  meuPerfil,
  editarPerfil,
  verCandidato
};