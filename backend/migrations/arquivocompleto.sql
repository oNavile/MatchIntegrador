CREATE DATABASE IF NOT EXISTS matchhire
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE matchhire;


CREATE TABLE usuarios (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo          ENUM('admin', 'empresa', 'candidato') NOT NULL,
  email         VARCHAR(180) UNIQUE,
  senha_hash    VARCHAR(255) NOT NULL,
  ativo         TINYINT(1) NOT NULL DEFAULT 1,
  criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE admins (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL UNIQUE,
  nome       VARCHAR(120) NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE empresas (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED NOT NULL UNIQUE,
  nome        VARCHAR(150) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  cnpj        VARCHAR(18)  NOT NULL UNIQUE,
  descricao   TEXT,
  telefone    char(11),
  cep         char(8),
  rua         VARCHAR(200),
  numero      VARCHAR(20),
  bairro      VARCHAR(100),
  cidade      VARCHAR(100),
  estado      char(2),
  arquivo     VARCHAR(255),  -- logo ou documento
  criado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE candidatos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED NOT NULL UNIQUE,
  nome        VARCHAR(150) NOT NULL,
  cpf         char(11)  NOT NULL UNIQUE,
  email       VARCHAR(180) NOT NULL,
  idade       TINYINT UNSIGNED,
  telefone    char(11),
  cep         char(8),
  rua         VARCHAR(200),
  numero      VARCHAR(20),
  bairro      VARCHAR(100),
  cidade      VARCHAR(100),
  estado      char(2),
  descricao   TEXT,
  arquivo     VARCHAR(255),  -- currículo
  criado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  foto VARCHAR(255),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE palavras_chave (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entidade_tipo  ENUM('empresa', 'candidato', 'vaga') NOT NULL,
  entidade_id    INT UNSIGNED NOT NULL,
  palavra        VARCHAR(80) NOT NULL,
  INDEX idx_entidade (entidade_tipo, entidade_id)
) ENGINE=InnoDB;

CREATE TABLE setores (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT UNSIGNED NOT NULL,
  nome       VARCHAR(100) NOT NULL,
  descricao  TEXT,
  criado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cargos (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setor_id   INT UNSIGNED NOT NULL,
  empresa_id INT UNSIGNED NOT NULL,
  nome       VARCHAR(100) NOT NULL,
  descricao  TEXT,
  salario    DECIMAL(10,2),
  criado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (setor_id)   REFERENCES setores(id)  ON DELETE CASCADE,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE funcionarios (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id     INT UNSIGNED NOT NULL,
  candidato_id   INT UNSIGNED NOT NULL,
  cargo_id       INT UNSIGNED,
  setor_id       INT UNSIGNED,
  data_admissao  DATE NOT NULL,
  data_demissao  DATE,
  status         ENUM('ativo','inativo','afastado') NOT NULL DEFAULT 'ativo',
  motivo_saida   TEXT,
  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id)   REFERENCES empresas(id)   ON DELETE CASCADE,
  FOREIGN KEY (candidato_id) REFERENCES candidatos(id) ON DELETE CASCADE,
  FOREIGN KEY (cargo_id)     REFERENCES cargos(id)     ON DELETE SET NULL,
  FOREIGN KEY (setor_id)     REFERENCES setores(id)    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE vagas (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id  INT UNSIGNED NOT NULL,
  cargo_id    INT UNSIGNED,
  setor_id    INT UNSIGNED,
  titulo      VARCHAR(150) NOT NULL,
  descricao   TEXT,
  requisitos  TEXT,
  local       VARCHAR(200),
  tipo        ENUM('presencial','remoto','hibrido') DEFAULT 'presencial',
  salario     DECIMAL(10,2),
  status      ENUM('aberta','encerrada','pausada') NOT NULL DEFAULT 'aberta',
  criado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (cargo_id)   REFERENCES cargos(id)   ON DELETE SET NULL,
  FOREIGN KEY (setor_id)   REFERENCES setores(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE candidaturas (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vaga_id       INT UNSIGNED NOT NULL,
  candidato_id  INT UNSIGNED NOT NULL,
  score_match   TINYINT UNSIGNED NOT NULL DEFAULT 0,  -- 0 a 100
  status        ENUM('pendente','em_analise','aprovado','reprovado','contratado') NOT NULL DEFAULT 'pendente',
  criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_candidatura (vaga_id, candidato_id),
  FOREIGN KEY (vaga_id)      REFERENCES vagas(id)      ON DELETE CASCADE,
  FOREIGN KEY (candidato_id) REFERENCES candidatos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE entrevistas (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidatura_id INT UNSIGNED NOT NULL,
  empresa_id     INT UNSIGNED NOT NULL,
  candidato_id   INT UNSIGNED NOT NULL,
  data_hora      DATETIME NOT NULL,
  tipo           ENUM('presencial','online') NOT NULL DEFAULT 'online',
  link_ou_local  VARCHAR(255),
  observacoes    TEXT,
  status         ENUM('agendada','realizada','cancelada') NOT NULL DEFAULT 'agendada',
  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidatura_id) REFERENCES candidaturas(id) ON DELETE CASCADE,
  FOREIGN KEY (empresa_id)     REFERENCES empresas(id)     ON DELETE CASCADE,
  FOREIGN KEY (candidato_id)   REFERENCES candidatos(id)   ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE contratos (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id     INT UNSIGNED NOT NULL,
  candidato_id   INT UNSIGNED NOT NULL,
  funcionario_id INT UNSIGNED NOT NULL,
  data_inicio    DATE NOT NULL,
  data_fim       DATE,
  status         ENUM('ativo','encerrado') NOT NULL DEFAULT 'ativo',
  arquivo        VARCHAR(255),  -- documento do contrato
  observacoes    TEXT,
  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id)     REFERENCES empresas(id)     ON DELETE CASCADE,
  FOREIGN KEY (candidato_id)   REFERENCES candidatos(id)   ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE logs_atividades (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT UNSIGNED,
  acao         VARCHAR(200) NOT NULL,
  descricao    TEXT,
  ip           VARCHAR(45),
  criado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO usuarios (tipo, email, senha_hash)
VALUES ('admin', 'admin@matchhire.com', '$2b$10$wQzQqHzHzHzHzHzHzHzHzuK1234567890abcdefghijklmno');

INSERT INTO admins (usuario_id, nome)
VALUES (1, 'Admin MatchHire');

USE matchhire;

UPDATE usuarios 
SET senha_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@matchhire.com';

USE matchhire;

CREATE TABLE IF NOT EXISTS planos (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome             VARCHAR(100) NOT NULL,
  preco_mensal     DECIMAL(10,2) NOT NULL,
  limite_funcionarios INT UNSIGNED NOT NULL,
  descricao        TEXT,
  ativo            TINYINT(1) NOT NULL DEFAULT 1,
  criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

  CREATE TABLE IF NOT EXISTS assinaturas (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empresa_id       INT UNSIGNED NOT NULL UNIQUE,
    plano_id         INT UNSIGNED NOT NULL,
    status           ENUM('ativa','expirada','cancelada','pendente') NOT NULL DEFAULT 'pendente',
    data_inicio      DATE,
    data_vencimento  DATE,
    renovacao_auto   TINYINT(1) NOT NULL DEFAULT 1,
    criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (plano_id)   REFERENCES planos(id)   ON DELETE RESTRICT
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pagamentos (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id       INT UNSIGNED NOT NULL,
  assinatura_id    INT UNSIGNED NOT NULL,
  plano_id         INT UNSIGNED NOT NULL,
  valor            DECIMAL(10,2) NOT NULL,
  status           ENUM('aprovado','recusado','pendente') NOT NULL DEFAULT 'pendente',
  metodo           ENUM('cartao','boleto','pix') NOT NULL DEFAULT 'cartao',
  simulado         TINYINT(1) NOT NULL DEFAULT 1,
  criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id)    REFERENCES empresas(id)     ON DELETE CASCADE,
  FOREIGN KEY (assinatura_id) REFERENCES assinaturas(id)  ON DELETE CASCADE,
  FOREIGN KEY (plano_id)      REFERENCES planos(id)       ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO planos (nome, preco_mensal, limite_funcionarios, descricao) VALUES
  ('Básico',      59.99,  100,   'Até 100 funcionários. Ideal para pequenas empresas.'),
  ('Profissional',109.99, 1000,  'Até 1.000 funcionários. Ideal para médias empresas.'),
  ('Enterprise',  309.99, 10000, 'Até 10.000 funcionários. Ideal para grandes empresas.');

  select * from usuarios;

USE matchhire;

UPDATE usuarios 
SET senha_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@matchhire.com';

-- Adiciona a coluna de tags na tabela de candidatos (se já não existir)
ALTER TABLE candidatos ADD COLUMN tags_perfil TEXT;

-- Adiciona a coluna de tags na tabela de vagas (se já não existir)
ALTER TABLE vagas ADD COLUMN tags_vaga TEXT;