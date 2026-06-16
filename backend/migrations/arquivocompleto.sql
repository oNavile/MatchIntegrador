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
  arquivo     VARCHAR(255),
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
  arquivo     VARCHAR(255),
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
  score_match   TINYINT UNSIGNED NOT NULL DEFAULT 0,
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
  arquivo        VARCHAR(255),
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

ALTER TABLE candidatos ADD COLUMN tags_perfil TEXT;

ALTER TABLE vagas ADD COLUMN tags_vaga TEXT;

CREATE TABLE IF NOT EXISTS favoritos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidato_id INT UNSIGNED NOT NULL,
  vaga_id      INT UNSIGNED NOT NULL,
  criado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uq_favorito (candidato_id, vaga_id),
  
  FOREIGN KEY (candidato_id) REFERENCES candidatos(id) ON DELETE CASCADE,
  FOREIGN KEY (vaga_id)      REFERENCES vagas(id)      ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE vagas_recusadas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vaga_id INT UNSIGNED NOT NULL,
    candidato_id INT UNSIGNED NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_recusa (vaga_id, candidato_id),

    FOREIGN KEY (vaga_id)
        REFERENCES vagas(id)
        ON DELETE CASCADE,

    FOREIGN KEY (candidato_id)
        REFERENCES candidatos(id)
        ON DELETE CASCADE
);

CREATE TABLE candidatos_rejeitados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vaga_id INT NOT NULL,
    candidato_id INT NOT NULL,
    data_rejeicao DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unico_rejeitado (vaga_id, candidato_id)
);

--Mudanças--

CREATE TABLE cursos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,

    valor DECIMAL(10,2) NOT NULL,

    imagem VARCHAR(255),

    ativo TINYINT(1) NOT NULL DEFAULT 1,

    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE videos_curso (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    curso_id INT UNSIGNED NOT NULL,

    titulo VARCHAR(150) NOT NULL,

    descricao TEXT,

    url_video TEXT NOT NULL,

    ordem INT UNSIGNED NOT NULL,

    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE compras_cursos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    candidato_id INT UNSIGNED NOT NULL,

    curso_id INT UNSIGNED NULL,

    tipo ENUM('curso','plano_completo') NOT NULL,

    valor_pago DECIMAL(10,2) NOT NULL,

    status ENUM(
        'pendente',
        'aprovado',
        'cancelado'
    ) NOT NULL DEFAULT 'aprovado',

    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (candidato_id)
        REFERENCES candidatos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE progresso_cursos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    candidato_id INT UNSIGNED NOT NULL,

    curso_id INT UNSIGNED NOT NULL,

    video_id INT UNSIGNED NOT NULL,

    concluido TINYINT(1) NOT NULL DEFAULT 1,

    concluido_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_video_concluido (
        candidato_id,
        video_id
    ),

    FOREIGN KEY (candidato_id)
        REFERENCES candidatos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (video_id)
        REFERENCES videos_curso(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE cursos
ADD COLUMN incluso_no_plano TINYINT(1) DEFAULT 1;

INSERT INTO cursos
(
 titulo,
 descricao,
 valor
)
VALUES
(
 'Gestão',
 'Curso gestão de empresas',
 49.90
);

INSERT INTO cursos
(
 titulo,
 descricao,
 valor
)
VALUES
(
 'Comunicação',
 'Curso de comunicação eficaz no ambiente profissional',
 59.90
);

INSERT INTO cursos
(
 titulo,
 descricao,
 valor
)
VALUES
(
 'Organização',
 'Curso de técnicas de organização pessoal e profissional',
 39.90
);

INSERT INTO cursos
(
 titulo,
 descricao,
 valor
)
VALUES
(
 'Liderança',
 'Curso sobre desenvolvimento de liderança e gestão de equipes',
 69.90
);

INSERT INTO cursos
(
 titulo,
 descricao,
 valor
)
VALUES
(
 'Marketing',
 'Curso de estratégias básicas e avançadas de marketing',
 79.90
);

INSERT INTO cursos
(
 titulo,
 descricao,
 valor
)
VALUES
(
 'Logística Empresarial',
 'Curso sobre processos logísticos e gestão da cadeia de suprimentos',
 89.90
);

INSERT INTO videos_curso
(curso_id, titulo, url_video, ordem)
VALUES
(1, 'Vídeo 1', 'https://youtu.be/roy-pY7pmwM?si=DIrMqpm7giVss174', 1),
(1, 'Vídeo 2', 'https://youtu.be/69l-iaw_Vz0?si=L5T6ETOmKN6-0xd-', 2),
(1, 'Vídeo 3', 'https://youtu.be/umCRABTz84Y?si=3Gk5v__ls6pUjql-', 3),
(1, 'Vídeo 4', 'https://youtu.be/ejZ9DKnKrYM?si=x6uafNRC5x9oXR5z', 4);

INSERT INTO videos_curso
(curso_id, titulo, url_video, ordem)
VALUES
(2, 'Vídeo 1', 'https://youtu.be/-G1jhqZ7qW8?si=JSjTZnRQOhk10xRy', 1),
(2, 'Vídeo 2', 'https://youtu.be/rqE_mxXlZik?si=di77QMxChHhDmnpb', 2),
(2, 'Vídeo 3', 'https://www.youtube.com/live/pbeEqyYe90k?si=cYA5EhZvdWYo-E65', 3),
(2, 'Vídeo 4', 'https://youtu.be/kWc51YUue5I?si=Md2ugtd8S5wjPSFG', 4); 

INSERT INTO videos_curso
(curso_id, titulo, url_video, ordem)
VALUES
(3, 'Vídeo 1', 'https://youtu.be/qUeYnJlUFJw?si=jL3jZlJRyrl1VRTd', 1),
(3, 'Vídeo 2', 'https://youtu.be/gvYdpnYWqdc?si=f3xvNdM7CgonqOWP', 2),
(3, 'Vídeo 3', 'https://youtu.be/yt7IxSWxbKE?si=hYg-YXksXGaV2HlQ', 3),
(3, 'Vídeo 4', 'https://youtu.be/R2NHZhQ3hFw?si=hO1pzaAbX5I_9NV9', 4);

INSERT INTO videos_curso
(curso_id, titulo, url_video, ordem)
VALUES
(4, 'Vídeo 1', 'https://youtu.be/6dJyysPLq0s?si=X4Q-HloV3CTV6FJR', 1),
(4, 'Vídeo 2', 'https://youtu.be/kokSkCIOZAY?si=fmqwXqzfBEb_ciiM', 2),
(4, 'Vídeo 3', 'https://youtu.be/RU08AijE32w?si=b_2I5fTLc-tAcS37', 3),
(4, 'Vídeo 4', 'https://youtu.be/c0FXi6gG4iU?si=9KGEXT67bcMSjm9_', 4);

INSERT INTO videos_curso
(curso_id, titulo, url_video, ordem)
VALUES
(5, 'Vídeo 1', 'https://youtu.be/yFvX0dENhJI?si=uJEdRAXZl_GyFn0p', 1),
(5, 'Vídeo 2', 'https://youtu.be/PozJfDfQA-Q?si=unHBkHH9NccdRgbh', 2),
(5, 'Vídeo 3', 'https://youtu.be/-dWvyd04uY8?si=lWvyC-iITNrmBP1g', 3),
(5, 'Vídeo 4', 'https://youtu.be/mfoH-hI01ao?si=1pCTqum1F_i0fk0G', 4);

INSERT INTO videos_curso
(curso_id, titulo, url_video, ordem)
VALUES
(6, 'Vídeo 1', 'https://youtu.be/XpP7ebpUgjc?si=Xl4ZYBRoFRlos3E6', 1),
(6, 'Vídeo 2', 'https://youtu.be/63o70UWJthM?si=DEEotYAM62kfYZ2Y', 2),
(6, 'Vídeo 3', 'https://youtu.be/OsF3VYZw3ik?si=_tbcYdOkasU9s3dU', 3),
(6, 'Vídeo 4', 'https://youtu.be/_dRQroLSmZQ?si=7KBjbATu5Xab4AkX', 4);