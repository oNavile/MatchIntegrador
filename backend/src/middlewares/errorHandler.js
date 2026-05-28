class AppError extends Error {
  constructor(mensagem, statusCode) {
    super(mensagem);
    this.statusCode = statusCode;
    this.operacional = true; // erro esperado, não bug
  }
}


class ErroNaoAutenticado extends AppError {
  constructor(msg = 'Token não fornecido. Faça login.') {
    super(msg, 401);
  }
}

class ErroAcessoNegado extends AppError {
  constructor(msg = 'Acesso negado para este perfil.') {
    super(msg, 403);
  }
}

class ErroNaoEncontrado extends AppError {
  constructor(recurso = 'Recurso') {
    super(`${recurso} não encontrado.`, 404);
  }
}

class ErroConflito extends AppError {
  constructor(msg = 'Registro já existe.') {
    super(msg, 409);
  }
}

class ErroValidacao extends AppError {
  constructor(msg = 'Dados inválidos ou incompletos.') {
    super(msg, 400);
  }
}

class ErroUpload extends AppError {
  constructor(msg = 'Erro no upload do arquivo.') {
    super(msg, 400);
  }
}

class ErroMatch extends AppError {
  constructor(msg = 'Não foi possível calcular o match.') {
    super(msg, 422);
  }
}

class ErroContrato extends AppError {
  constructor(msg = 'Erro na operação de contrato.') {
    super(msg, 422);
  }
}

const errorHandler = (err, req, res, next) => {
  
  console.error(`\n❌ [${new Date().toLocaleString('pt-BR')}] ERRO:`);
  console.error(`   Rota   : ${req.method} ${req.originalUrl}`);
  console.error(`   Mensagem: ${err.message}`);
  if (!err.operacional) console.error(`   Stack  : ${err.stack}`);


  if (err.operacional) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    const campo = err.message.includes('cnpj') ? 'CNPJ'
                : err.message.includes('cpf')  ? 'CPF'
                : err.message.includes('email') ? 'E-mail'
                : 'Campo';
    return res.status(409).json({ erro: `${campo} já cadastrado no sistema.` });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ erro: 'Referência inválida. Verifique os dados enviados.' });
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({ erro: 'Não é possível remover. Este registro está em uso.' });
  }

  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({ erro: 'Serviço de banco de dados indisponível.' });
  }

 
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ erro: 'Token inválido. Faça login novamente.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ erro: 'Sessão expirada. Faça login novamente.' });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      erro: `Arquivo muito grande. Tamanho máximo: ${process.env.UPLOAD_MAX_SIZE_MB || 5}MB.`
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ erro: 'Campo de arquivo inesperado.' });
  }

  if (err.message && err.message.includes('Tipo de arquivo não permitido')) {
    return res.status(400).json({ erro: err.message });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }


  return res.status(500).json({
    erro: 'Erro interno do servidor. Tente novamente mais tarde.'
  });
};


const rotaNaoEncontrada = (req, res) => {
  res.status(404).json({
    erro: `Rota '${req.method} ${req.originalUrl}' não encontrada.`
  });
};

module.exports = {
  errorHandler,
  rotaNaoEncontrada,
  AppError,
  ErroNaoAutenticado,
  ErroAcessoNegado,
  ErroNaoEncontrado,
  ErroConflito,
  ErroValidacao,
  ErroUpload,
  ErroMatch,
  ErroContrato,
};
