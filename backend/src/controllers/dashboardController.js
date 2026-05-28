// src/controllers/dashboardController.js
const db = require('../config/database');

// ── Dashboard da Empresa ─────────────────────────────────────
const dashboardEmpresa = async (req, res) => {
  try {
    const [[empresa]] = await db.execute(
      `SELECT id, nome FROM empresas WHERE usuario_id = ?`, [req.usuario.id]
    );
    if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada.' });

    const empresaId = empresa.id;

    // Contagem de funcionários
    const [[{ ativos }]] = await db.execute(
      `SELECT COUNT(*) AS ativos FROM funcionarios WHERE empresa_id = ? AND status = 'ativo'`,
      [empresaId]
    );
    const [[{ inativos }]] = await db.execute(
      `SELECT COUNT(*) AS inativos FROM funcionarios WHERE empresa_id = ? AND status = 'inativo'`,
      [empresaId]
    );

    // Vagas
    const [[{ vagas_abertas }]] = await db.execute(
      `SELECT COUNT(*) AS vagas_abertas FROM vagas WHERE empresa_id = ? AND status = 'aberta'`,
      [empresaId]
    );
    const [[{ total_candidaturas }]] = await db.execute(
      `SELECT COUNT(*) AS total_candidaturas
       FROM candidaturas c JOIN vagas v ON v.id = c.vaga_id
       WHERE v.empresa_id = ?`,
      [empresaId]
    );

    // Admissões do mês atual
    const [[{ admissoes_mes }]] = await db.execute(
      `SELECT COUNT(*) AS admissoes_mes FROM funcionarios
       WHERE empresa_id = ? AND MONTH(data_admissao) = MONTH(NOW()) AND YEAR(data_admissao) = YEAR(NOW())`,
      [empresaId]
    );

    // Demissões do mês atual
    const [[{ demissoes_mes }]] = await db.execute(
      `SELECT COUNT(*) AS demissoes_mes FROM funcionarios
       WHERE empresa_id = ? AND status = 'inativo'
         AND MONTH(data_demissao) = MONTH(NOW()) AND YEAR(data_demissao) = YEAR(NOW())`,
      [empresaId]
    );

    // Entrevistas agendadas
    const [[{ entrevistas_agendadas }]] = await db.execute(
      `SELECT COUNT(*) AS entrevistas_agendadas FROM entrevistas
       WHERE empresa_id = ? AND status = 'agendada' AND data_hora >= NOW()`,
      [empresaId]
    );

    // Top 5 candidatos por score
    const [top_candidatos] = await db.execute(
      `SELECT cand.nome, c.score_match, v.titulo AS vaga, c.status
       FROM candidaturas c
       JOIN candidatos cand ON cand.id = c.candidato_id
       JOIN vagas v ON v.id = c.vaga_id
       WHERE v.empresa_id = ?
       ORDER BY c.score_match DESC
       LIMIT 5`,
      [empresaId]
    );

    res.json({
      empresa: empresa.nome,
      funcionarios: { ativos, inativos },
      vagas: { abertas: vagas_abertas, total_candidaturas },
      movimentacoes: { admissoes_mes, demissoes_mes },
      entrevistas_agendadas,
      top_candidatos
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar dashboard.' });
  }
};

// ── Dashboard do Admin (visão geral da plataforma) ───────────
const dashboardAdmin = async (req, res) => {
  try {
    const [[{ total_empresas }]]    = await db.execute(`SELECT COUNT(*) AS total_empresas FROM empresas`);
    const [[{ total_candidatos }]]  = await db.execute(`SELECT COUNT(*) AS total_candidatos FROM candidatos`);
    const [[{ total_vagas }]]       = await db.execute(`SELECT COUNT(*) AS total_vagas FROM vagas`);
    const [[{ vagas_abertas }]]     = await db.execute(`SELECT COUNT(*) AS vagas_abertas FROM vagas WHERE status = 'aberta'`);
    const [[{ total_candidaturas }]]= await db.execute(`SELECT COUNT(*) AS total_candidaturas FROM candidaturas`);
    const [[{ total_contratados }]] = await db.execute(`SELECT COUNT(*) AS total_contratados FROM funcionarios WHERE status = 'ativo'`);

    // Empresas recentes
    const [empresas_recentes] = await db.execute(
      `SELECT nome, cnpj, criado_em FROM empresas ORDER BY criado_em DESC LIMIT 5`
    );

    // Candidatos recentes
    const [candidatos_recentes] = await db.execute(
      `SELECT nome, email, criado_em FROM candidatos ORDER BY criado_em DESC LIMIT 5`
    );

    res.json({
      totais: {
        empresas: total_empresas,
        candidatos: total_candidatos,
        vagas: total_vagas,
        vagas_abertas,
        candidaturas: total_candidaturas,
        funcionarios_ativos: total_contratados
      },
      empresas_recentes,
      candidatos_recentes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar dashboard admin.' });
  }
};

// ── Dashboard do Candidato ───────────────────────────────────
const dashboardCandidato = async (req, res) => {
  try {
    const [[candidato]] = await db.execute(
      `SELECT id, nome FROM candidatos WHERE usuario_id = ?`, [req.usuario.id]
    );
    if (!candidato) return res.status(404).json({ erro: 'Candidato não encontrado.' });

    const candidatoId = candidato.id;

    const [[{ total_candidaturas }]] = await db.execute(
      `SELECT COUNT(*) AS total_candidaturas FROM candidaturas WHERE candidato_id = ?`,
      [candidatoId]
    );

    const [[{ entrevistas_agendadas }]] = await db.execute(
      `SELECT COUNT(*) AS entrevistas_agendadas FROM entrevistas
       WHERE candidato_id = ? AND status = 'agendada' AND data_hora >= NOW()`,
      [candidatoId]
    );

    // Minhas candidaturas com score
    const [minhas_candidaturas] = await db.execute(
      `SELECT c.id, v.titulo, emp.nome AS empresa, c.score_match, c.status, c.criado_em
       FROM candidaturas c
       JOIN vagas    v   ON v.id   = c.vaga_id
       JOIN empresas emp ON emp.id = v.empresa_id
       WHERE c.candidato_id = ?
       ORDER BY c.score_match DESC`,
      [candidatoId]
    );

    res.json({
      candidato: candidato.nome,
      total_candidaturas,
      entrevistas_agendadas,
      minhas_candidaturas
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar dashboard candidato.' });
  }
};

module.exports = { dashboardEmpresa, dashboardAdmin, dashboardCandidato };
