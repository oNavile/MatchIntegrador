Testar o Login do Admin:
POST - http://localhost:3001/api/auth/login
{
  "identificador": "admin@matchhire.com",
  "senha": "password"
}
.....................................................
Cadastro de Empresa: 
POST - http://localhost:3001/api/auth/cadastro/empresa
{
  "nome": "NovaTech Solutions",
  "email": "contato.novatech482@gmail.com",
  "cnpj": "48.392.715/0001-26",
  "senha": "Senha@123",
  "descricao": "Empresa especializada em desenvolvimento de software e soluções digitais.",
  "telefone": "11987654321",
  "cep": "04567000",
  "rua": "Rua das Palmeiras",
  "numero": "245",
  "bairro": "Jardim Paulista",
  "cidade": "São Paulo",
  "estado": "SP",
  "palavras_chave": [
    "javascript",
    "node",
    "mysql",
    "backend"
  ]
}
.................................................
Cadastro de Candidato:
POST - http://localhost:3001/api/auth/cadastro/candidato
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao1@teste.com",
  "senha": "123456",
  "idade": 25,
  "telefone": "11988888888",
  "cep": "12345-678",
  "rua": "da zona",
  "numero": "11",
  "bairro": "perdizes",
  "cidade": "osasco",
  "estado": "SP",
  "descricao": "Desenvolvedor frontend",
  "palavras_chave": [
    "javascript",
    "react",
    "node",
    "mysql"
  ]
}
...................................
Criar uma Vaga
POST - http://localhost:3001/api/vagas
(BEARER TOKEN EMPRESA)
{
  "titulo": "Desenvolvedor Frontend",
  "descricao": "Vaga para desenvolvedor frontend",
  "requisitos": "Experiência com React e JavaScript",
  "local": "Santo André - SP",
  "tipo": "presencial",
  "salario": 4500,
  "palavras_chave": ["javascript", "react", "node", "mysql"]
}
...................................
 Candidatar-se à Vaga
POST - http://localhost:3001/api/candidaturas
(BEARER token que veio no cadastro do candidato)
{
  "vaga_id": 1
}
........................................................
Ranking de Candidatos por Vaga
GET - http://localhost:3001/api/vagas/1/ranking
(Bearer TOKEN_DA_EMPRESA)
............................................................
Dashboard da Empresa
GET - http://localhost:3001/api/dashboard/empresa
(Bearer TOKEN_DA_EMPRESA)
.................................................
Criar Setor 
POST - http://localhost:3001/api/rh/setores
(Bearer TOKEN_DA_EMPRESA)
{
  "nome": "Tecnologia",
  "descricao": "Setor de desenvolvimento de software"
}
................................................
Criar Cargo
POST - http://localhost:3001/api/rh/cargos
(Bearer TOKEN_DA_EMPRESA)
{
  "nome": "Desenvolvedor Frontend",
  "descricao": "Responsável pelo desenvolvimento frontend",
  "salario": 4500,
  "setor_id": 1
}
........................................................
Admitir Funcionário
POST - http://localhost:3001/api/funcionarios/admitir
 (Bearer TOKEN_DA_EMPRESA)
{
  "candidato_id": 1,
  "cargo_id": 1,
  "setor_id": 1,
  "data_admissao": "2026-05-15"
}
..................................................
 Agendar Entrevista
Método: POST
URL: http://localhost:3001/api/entrevistas


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI


Aba Body → JSON, cole:

json{
  "candidatura_id": 1,
  "candidato_id": 1,
  "data_hora": "2026-05-20 10:00:00",
  "tipo": "online",
  "link_ou_local": "https://meet.google.com/teste",
  "observacoes": "Entrevista técnica"
}
.....................................................
Dashboard Admin

New Request no Thunder Client
Configure:

Método: GET
URL: http://localhost:3001/api/dashboard/admin


Aba Headers, adicione:

Authorization → Bearer TOKEN_DO_ADMIN_AQUI
........................................................
Dashboard Candidato

New Request no Thunder Client
Configure:

Método: GET
URL: http://localhost:3001/api/dashboard/candidato


Aba Headers, adicione:

Authorization → Bearer TOKEN_DO_CANDIDATO_AQUI
..................................................................
Passo 14 — Ver Perfil

New Request no Thunder Client
Configure:

Método: GET
URL: http://localhost:3001/api/perfil


Aba Headers, adicione:

Authorization → Bearer TOKEN_DO_CANDIDATO_AQUI
......................................................................
Passo 15 — Listar Vagas

New Request no Thunder Client
Configure:

Método: GET
URL: http://localhost:3001/api/vagas


Aba Headers, adicione:

Authorization → Bearer TOKEN_DO_CANDIDATO_AQUI
........................................................................
Passo 16 — Listar Funcionários

New Request no Thunder Client
Configure:

Método: GET
URL: http://localhost:3001/api/funcionarios


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI
.....................................................................
Ranking de Funcionários

New Request no Thunder Client
Configure:

Método: GET
URL: http://localhost:3001/api/funcionarios/ranking


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI
.................................................................
Listar Entrevistas

New Request no Thunder Client
Configure:

Método: GET
URL: http://localhost:3001/api/entrevistas


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI
........................................................
Login da Empresa

New Request no Thunder Client
Configure:

Método: POST
URL: http://localhost:3001/api/auth/login


Aba Body → JSON, cole:

json{
  "identificador": "Teste",
  "senha": "123456"
}
..........................................................
Login do Candidato

New Request no Thunder Client
Configure:

Método: POST
URL: http://localhost:3001/api/auth/login


Aba Body → JSON, cole:

json{
  "identificador": "joao@teste.com",
  "senha": "123456"
}
......................................................
 Desligar Funcionário

New Request no Thunder Client
Configure:

Método: PUT
URL: http://localhost:3001/api/funcionarios/1/desligar


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI


Aba Body → JSON, cole:

json{
  "motivo_saida": "Encerramento de contrato",
  "data_demissao": "2026-05-15"
}
.........................................................
 Editar Perfil

New Request no Thunder Client
Configure:

Método: PUT
URL: http://localhost:3001/api/perfil


Aba Headers, adicione:

Authorization → Bearer TOKEN_DO_CANDIDATO_AQUI


Aba Body → JSON, cole:

json{
  "nome": "João Silva Atualizado",
  "idade": 26,
  "telefone": "11977777777",
  "descricao": "Desenvolvedor frontend sênior"
}
....................................................
Empresa ver perfil de Candidato
New Request no Thunder Client
Configure:

Método: GET
URL: http://localhost:3001/api/perfil/candidatos/1


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI
............................................................
Atualizar Status da Vaga

New Request no Thunder Client
Configure:

Método: PUT
URL: http://localhost:3001/api/vagas/1


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI


Aba Body → JSON, cole:

json{
  "status": "encerrada"
}
...............................................................
Atualizar Cargo/Setor do Funcionário

New Request no Thunder Client
Configure:

Método: PUT
URL: http://localhost:3001/api/funcionarios/1


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI


Aba Body → JSON, cole:

json{
  "cargo_id": 1,
  "setor_id": 1
}
.........................................................
Atualizar Status da Entrevista

New Request no Thunder Client
Configure:

Método: PUT
URL: http://localhost:3001/api/entrevistas/1


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI


Aba Body → JSON, cole:

json{
  "status": "realizada"
}
.....................................................
Editar Setor

New Request no Thunder Client
Configure:

Método: PUT
URL: http://localhost:3001/api/rh/setores/1


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI


Aba Body → JSON, cole:

json{
  "nome": "Tecnologia da Informação",
  "descricao": "Setor de TI atualizado"
}
..............................................................
Editar Cargo

New Request no Thunder Client
Configure:

Método: PUT
URL: http://localhost:3001/api/rh/cargos/1


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI


Aba Body → JSON, cole:

json{
  "nome": "Desenvolvedor Frontend Sênior",
  "salario": 6000
}
...........................................................
Deletar Setor

New Request no Thunder Client
Configure:

Método: DELETE
URL: http://localhost:3001/api/rh/setores/1


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI
...............................................................
 Deletar Cargo

New Request no Thunder Client
Configure:

Método: DELETE
URL: http://localhost:3001/api/rh/cargos/1


Aba Headers, adicione:

Authorization → Bearer TOKEN_DA_EMPRESA_AQUI
.........................................................
Listar Funcionários
GET - http://localhost:3001/api/funcionarios
.......................................................
Listar planos
GET - http://localhost:3001/api/planos
..................................................
Testar adicionar assinaturas
POST http://localhost:3001/api/assinaturas
{
  "empresa_id": 1,
  "plano_id": 1
}
.....................................................



