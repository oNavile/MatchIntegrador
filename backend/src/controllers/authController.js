const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/database');

const gerarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

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
      estado
    } = req.body;

    if (!nome || !email || !cnpj || !senha)
      return res.status(400).json({
        erro: 'Nome, e-mail, CNPJ e senha são obrigatórios.'
      });

    
    const [[emailExiste]] = await conn.execute(
      `SELECT id FROM usuarios WHERE email = ?`,
      [email]
    );

    if (emailExiste)
      return res.status(409).json({
        erro: 'E-mail já cadastrado.'
      });

    
    const [[existe]] = await conn.execute(
      `SELECT id FROM empresas WHERE cnpj = ?`,
      [cnpj]
    );

    if (existe)
      return res.status(409).json({
        erro: 'CNPJ já cadastrado.'
      });

    const senhaHash = await bcrypt.hash(senha, 10);

    const logo_arquivo = req.files && req.files['logo'] ? req.files['logo'][0].filename : null;

    const [resUsuario] = await conn.execute(
      `INSERT INTO usuarios (tipo, email, senha_hash) VALUES ('empresa', ?, ?)`,
      [email, senhaHash]
    );

    const usuarioId = resUsuario.insertId;

    const [resEmpresa] = await conn.execute(
      `INSERT INTO empresas (
        usuario_id, nome, email, cnpj, descricao, telefone, 
        cep, rua, numero, bairro, cidade, estado, arquivo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId, nome, email, cnpj,
        descricao || null, telefone  || null, cep || null, rua || null,
        numero || null, bairro || null, cidade || null, estado || null,
        logo_arquivo || null
      ]
    );

    const empresaId = resEmpresa.insertId;

    await conn.commit();

    const token = gerarToken({ id: usuarioId, tipo: 'empresa' });

    res.status(201).json({
      mensagem: 'Empresa cadastrada com sucesso!',
      token,
      perfil: {
        id: empresaId,
        nome,
        email,
        tipo: 'empresa',
        foto: logo_arquivo ? `http://localhost:3001/uploads/logos/${logo_arquivo}` : null
      }
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao cadastrar empresa.' });
  } finally {
    conn.release();
  }
};

const cadastrarCandidato = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { nome, cpf, email, senha, idade, telefone,
            cep, rua, numero, bairro, cidade, estado,
            descricao, tags_perfil } = req.body;

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

    const foto = req.files && req.files['foto_perfil'] ? req.files['foto_perfil'][0].filename : null;
    const arquivo = req.files && req.files['curriculo'] ? req.files['curriculo'][0].filename : null;

    const [resUsuario] = await conn.execute(
      `INSERT INTO usuarios (tipo, email, senha_hash) VALUES ('candidato', ?, ?)`,
      [email, senhaHash]
    );
    const usuarioId = resUsuario.insertId;

    const [resCandidato] = await conn.execute(
      `INSERT INTO candidatos (usuario_id, nome, cpf, email, idade, telefone,
        cep, rua, numero, bairro, cidade, estado, descricao, arquivo, foto, tags_perfil)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId, nome, cpf, email,
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
        foto       || null,
        tags_perfil|| null
      ]
    );
    const candidatoId = resCandidato.insertId;

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
      const [[e]] = await db.execute(
        `SELECT id, nome, email, arquivo FROM empresas WHERE usuario_id = ?`,
        [usuario.id]
      );
      perfil = { 
        id: e.id,
        nome: e.nome,
        email: e.email,
        tipo: 'empresa',
        foto: e.arquivo ? `http://localhost:3001/uploads/logos/${e.arquivo}` : null
      };
    } else if (usuario.tipo === 'candidato') {
      const [[c]] = await db.execute(
        `SELECT id, nome, email, foto, arquivo FROM candidatos WHERE usuario_id = ?`,
        [usuario.id]
      );
      perfil = { 
        id: c.id,
        nome: c.nome,
        email: c.email, 
        tipo: 'candidato',
        foto: c.foto ? `http://localhost:3001/uploads/curriculos/${c.foto}` : null,
        curriculo: c.arquivo ? `http://localhost:3001/uploads/curriculos/${c.arquivo}` : null
      };
    } else {
      let a = null;
      try {
        const [rows] = await db.execute(
          `SELECT id, nome FROM admins WHERE usuario_id = ?`,
          [usuario.id]
        );
        if (rows && rows.length > 0) a = rows[0];
      } catch (e) {
        console.error("Aviso: Falha ao buscar na tabela admins", e.message);
      }
      
      perfil = { 
        id: a ? a.id : usuario.id,
        nome: a ? a.nome : "Administrador Principal",
        email: usuario.email, 
        tipo: 'admin',
        foto: null 
      };
    }

    const token = gerarToken({ id: usuario.id, tipo: usuario.tipo });

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      perfil
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao realizar login.' });
  }
};

module.exports = {
  cadastrarEmpresa,
  cadastrarCandidato,
  login
};