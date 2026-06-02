// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/database');

// ── Helpers ──────────────────────────────────────────────────

const gerarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const salvarPalavrasChave = async (conn, tipo, id, palavras = []) => {
  await conn.execute(
    `DELETE FROM palavras_chave WHERE entidade_tipo = ? AND entidade_id = ?`,
    [tipo, id]
  );
  const limitadas = palavras.slice(0, 8);
  for (const palavra of limitadas) {
    if (palavra && palavra.trim()) {
      await conn.execute(
        `INSERT INTO palavras_chave (entidade_tipo, entidade_id, palavra) VALUES (?, ?, ?)`,
        [tipo, id, palavra.trim().toLowerCase()]
      );
    }
  }
};

// ── Cadastro de Empresa ──────────────────────────────────────
const cadastrarEmpresa = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      nome,
      email,
      cnpj,
      senha,
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

    if (!nome || !email || !cnpj || !senha)
      return res.status(400).json({
        erro: 'Nome, e-mail, CNPJ e senha são obrigatórios.'
      });

    // verifica email
    const [[emailExiste]] = await conn.execute(
      `SELECT id FROM usuarios WHERE email = ?`,
      [email]
    );

    if (emailExiste)
      return res.status(409).json({
        erro: 'E-mail já cadastrado.'
      });

    // verifica cnpj
    const [[existe]] = await conn.execute(
      `SELECT id FROM empresas WHERE cnpj = ?`,
      [cnpj]
    );

    if (existe)
      return res.status(409).json({
        erro: 'CNPJ já cadastrado.'
      });

    const senhaHash = await bcrypt.hash(senha, 10);
    // DENTRO DO SEU CONTROLLER DE CADASTRO (no backend)
// O multer gera o array req.files. Garanta que você está pegando as chaves certas:

const foto_perfil_arquivo = req.files['foto_perfil'] ? req.files['foto_perfil'][0] : null;
const curriculo_arquivo = req.files['curriculo'] ? req.files['curriculo'][0] : null;

// Agora, monta a URL de cada um apontando para a pasta que eles REALMENTE foram (curriculos):
const url_foto = foto_perfil_arquivo 
  ? `http://localhost:3001/uploads/curriculos/${foto_perfil_arquivo.filename}` 
  : null;

const url_curriculo = curriculo_arquivo 
  ? `http://localhost:3001/uploads/curriculos/${curriculo_arquivo.filename}` 
  : null;

// Na hora de rodar o INSERT INTO candidatos no MySQL, passe as variáveis certas:
// ... [nome, email, cpf, url_foto, url_curriculo]

    // salva usuario
    const [resUsuario] = await conn.execute(
      `INSERT INTO usuarios (tipo, email, senha_hash)
       VALUES ('empresa', ?, ?)`,
      [email, senhaHash]
    );

    const usuarioId = resUsuario.insertId;

    // salva empresa
    const [resEmpresa] = await conn.execute(
      `INSERT INTO empresas (
        usuario_id,
        nome,
        email,
        cnpj,
        descricao,
        telefone,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        arquivo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        nome,
        email,
        cnpj,
        descricao || null,
        telefone  || null,
        cep       || null,
        rua       || null,
        numero    || null,
        bairro    || null,
        cidade    || null,
        estado    || null,
        arquivo   || null
      ]
    );

    const empresaId = resEmpresa.insertId;

    const pcs = Array.isArray(palavras_chave)
      ? palavras_chave
      : JSON.parse(palavras_chave || '[]');

    await salvarPalavrasChave(
      conn,
      'empresa',
      empresaId,
      pcs
    );

    await conn.commit();

    const token = gerarToken({
      id: usuarioId,
      tipo: 'empresa'
    });

    res.status(201).json({
      mensagem: 'Empresa cadastrada com sucesso!',
      token,
      perfil: {
        id: empresaId,
        nome,
        email,
        tipo: 'empresa',
        foto: arquivo ? `http://localhost:3001/uploads/logos/${arquivo}` : null // 🔥 Foto injetada no cadastro
      }
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({
      erro: 'Erro interno ao cadastrar empresa.'
    });
  } finally {
    conn.release();
  }
};

// ── Cadastro de Candidato ────────────────────────────────────
const cadastrarCandidato = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { nome, cpf, email, senha, idade, telefone,
            cep, rua, numero, bairro, cidade, estado,
            descricao, palavras_chave } = req.body;

    if (!nome || !cpf || !email || !senha)
      return res.status(400).json({ erro: 'Nome, CPF, e-mail e senha são obrigatórios.' });

    const [[emailExiste]] = await conn.execute(
      `SELECT id FROM usuarios WHERE email = ?`, [email]
    );
    if (emailExiste)
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });

    const [[cpfExiste]] = await conn.execute(
      `SELECT id FROM candidatos WHERE cpf = ?`, [cpf]
    );
    if (cpfExiste)
      return res.status(409).json({ erro: 'CPF já cadastrado.' });

    const senhaHash = await bcrypt.hash(senha, 10);

    // 🛠️ ALTERAÇÃO: Captura os arquivos múltiplos vindos do upload.fields()
    const foto = req.files && req.files['foto_perfil'] ? req.files['foto_perfil'][0].filename : null;
    const arquivo = req.files && req.files['curriculo'] ? req.files['curriculo'][0].filename : null;

    const [resUsuario] = await conn.execute(
      `INSERT INTO usuarios (tipo, email, senha_hash) VALUES ('candidato', ?, ?)`,
      [email, senhaHash]
    );
    const usuarioId = resUsuario.insertId;

    // 🛠️ ALTERAÇÃO: Adicionado o campo 'foto' na Query e na lista de valores do INSERT
    const [resCandidato] = await conn.execute(
      `INSERT INTO candidatos (usuario_id, nome, cpf, email, idade, telefone,
        cep, rua, numero, bairro, cidade, estado, descricao, arquivo, foto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        nome,
        cpf,
        email,
        idade      || null,
        telefone   || null,
        cep        || null,
        rua        || null,
        numero     || null,
        bairro     || null,
        cidade     || null,
        estado     || null,
        descricao  || null,
        arquivo    || null,
        foto       || null // 🔥 Nova variável da foto inserida aqui
      ]
    );
    const candidatoId = resCandidato.insertId;

    const pcs = Array.isArray(palavras_chave)
      ? palavras_chave
      : JSON.parse(palavras_chave || '[]');
    
    // 🛠️ ALTERAÇÃO: Limita o array recebido em no máximo 8 palavras-chave antes de salvar
    const pcsLimitadas = pcs.slice(0, 8);
    await salvarPalavrasChave(conn, 'candidato', candidatoId, pcsLimitadas);

    await conn.commit();

    const token = gerarToken({ id: usuarioId, tipo: 'candidato' });
    res.status(201).json({
      mensagem: 'Candidato cadastrado com sucesso!',
      token,
      perfil: { 
        id: candidatoId, 
        nome, 
        email, 
        tipo: 'candidato',
        // 🛠️ ALTERAÇÃO: Agora retorna a URL correta da foto e o currículo se existirem
        foto: foto ? `http://localhost:3001/uploads/curriculos/${foto}` : null,
        curriculo: arquivo ? `http://localhost:3001/uploads/curriculos/${arquivo}` : null
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao cadastrar candidato.' });
  } finally {
    conn.release();
  }
};

// ── Login ────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { identificador, senha } = req.body;

    if (!identificador || !senha)
      return res.status(400).json({ erro: 'Identificador e senha são obrigatórios.' });

    let usuario = null;

    const [[porEmail]] = await db.execute(
      `SELECT * FROM usuarios WHERE email = ? AND ativo = 1`,
      [identificador]
    );

    if (porEmail) {
      usuario = porEmail;
    } else {
      const [[empresa]] = await db.execute(
        `SELECT u.* FROM usuarios u
         JOIN empresas e ON e.usuario_id = u.id
         WHERE (e.nome = ? OR e.cnpj = ?) AND u.ativo = 1`,
        [identificador, identificador]
      );
      if (empresa) usuario = empresa;
    }

    if (!usuario)
      return res.status(401).json({ erro: 'Usuário não encontrado.' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta)
      return res.status(401).json({ erro: 'Senha incorreta.' });

    let perfil;

    if (usuario.tipo === 'empresa') {
      // 🔥 Adicionado 'arquivo' na busca de empresas
      const [[e]] = await db.execute(
        `SELECT id, nome, email, arquivo FROM empresas WHERE usuario_id = ?`,
        [usuario.id]
      );
      perfil = { 
        id: e.id,
        nome: e.nome,
        email: e.email,
        tipo: 'empresa',
        foto: e.arquivo ? `http://localhost:3001/uploads/curriculos/${e.arquivo}` : null // 🔥 Caminho completo da foto corporativa
      };
    } else if (usuario.tipo === 'candidato') {
      // 🔥 Adicionado 'email' e 'arquivo' na busca do candidato
      const [[c]] = await db.execute(
        `SELECT id, nome, email, arquivo FROM candidatos WHERE usuario_id = ?`,
        [usuario.id]
      );
      perfil = { 
        id: c.id,
        nome: c.nome,
        email: c.email, // 🔥 Agora o e-mail vai para o front!
        tipo: 'candidato',
        foto: c.arquivo ? `http://localhost:3001/uploads/curriculos/${c.arquivo}` : null // 🔥 Caminho completo da foto de perfil
      };
    } else {
      // Busca na tabela admins usando um bloco try/catch interno para não derrubar o servidor
      let a = null;
      try {
        const [rows] = await db.execute(
          `SELECT id, nome FROM admins WHERE usuario_id = ?`,
          [usuario.id]
        );
        if (rows && rows.length > 0) {
          a = rows[0];
        }
      } catch (e) {
        console.error("Aviso: Falha ao buscar na tabela admins", e.message);
      }
      
      // Se não achou a linha na tabela 'admins', ele cria um perfil padrão usando os dados de 'usuarios'
      perfil = { 
        id: a ? a.id : usuario.id,
        nome: a ? a.nome : "Administrador Principal",
        email: usuario.email, 
        tipo: 'admin',
        foto: null 
      };
    }

    const token = gerarToken({
      id: usuario.id,
      tipo: usuario.tipo
    });

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      perfil
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      erro: 'Erro interno ao realizar login.'
    });
  }
};

module.exports = {
  cadastrarEmpresa,
  cadastrarCandidato,
  login
};