const db = require("../config/database");

// FUNÇÃO PRECISA EXISTIR ANTES DE EXPORTAR
async function getDashboardCandidato(req, res) {
    try {
        const candidatoId = req.usuario.id;

        const [vagasSistema] = await db.query(
            "SELECT COUNT(*) AS total FROM vagas"
        );

        const [candidaturas] = await db.query(
            "SELECT COUNT(*) AS total FROM candidaturas WHERE candidato_id = ?",
            [candidatoId]
        );

        const [ultimaVaga] = await db.query(
            "SELECT id, titulo, empresa_id FROM vagas ORDER BY id DESC LIMIT 1"
        );

        return res.json({
            vagasSistema: vagasSistema[0].total || 0,
            seusMatches: candidaturas[0].total || 0,
            candidaturas: candidaturas[0].total || 0,
            ultimaVaga: ultimaVaga[0] || null
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro no dashboard" });
    }
}

async function getDashboardEmpresa(req, res) {
    try {
        const usuarioId = req.usuario.id;

        // Busca a empresa vinculada ao usuário logado
        const [empresaRows] = await db.query(
            "SELECT id, nome FROM empresas WHERE usuario_id = ?",
            [usuarioId]
        );

        if (!empresaRows.length) {
            return res.status(404).json({
                message: "Empresa não encontrada"
            });
        }

        const empresaId = empresaRows[0].id;

        // Total de vagas
        const [vagas] = await db.query(
            "SELECT COUNT(*) AS total FROM vagas WHERE empresa_id = ?",
            [empresaId]
        );

        // Total de funcionários
        const [funcionarios] = await db.query(
            "SELECT COUNT(*) AS total FROM funcionarios WHERE empresa_id = ?",
            [empresaId]
        );

        // Total de candidaturas recebidas
        const [candidaturas] = await db.query(
            `SELECT COUNT(*) AS total
             FROM candidaturas c
             INNER JOIN vagas v ON v.id = c.vaga_id
             WHERE v.empresa_id = ?`,
            [empresaId]
        );

        // Última vaga criada
        const [ultimaVaga] = await db.query(
            `SELECT id, titulo, status
             FROM vagas
             WHERE empresa_id = ?
             ORDER BY id DESC
             LIMIT 1`,
            [empresaId]
        );

        return res.json({
            empresa: empresaRows[0].nome,
            totalVagas: vagas[0].total || 0,
            totalFuncionarios: funcionarios[0].total || 0,
            totalCandidaturas: candidaturas[0].total || 0,
            ultimaVaga: ultimaVaga[0] || null
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Erro no dashboard da empresa"
        });
    }
}

async function getDashboardAdmin(req, res) {
    try {
        const [empresas] = await db.query(
            "SELECT COUNT(*) AS total FROM empresas"
        );

        const [candidatos] = await db.query(
            "SELECT COUNT(*) AS total FROM candidatos"
        );

        const [vagas] = await db.query(
            "SELECT COUNT(*) AS total FROM vagas"
        );

        const [funcionarios] = await db.query(
            "SELECT COUNT(*) AS total FROM funcionarios WHERE status = 'ativo'"
        );

        const [ultimaEmpresa] = await db.query(`
            SELECT nome
            FROM empresas
            ORDER BY id DESC
            LIMIT 1
        `);

        const [ultimoCandidato] = await db.query(`
            SELECT nome
            FROM candidatos
            ORDER BY id DESC
            LIMIT 1
        `);

        const [usuarios] = await db.query(
            "SELECT COUNT(*) AS total FROM usuarios"
        );

        const [admins] = await db.query(
            "SELECT COUNT(*) AS total FROM admins"
        );

        return res.json({
            totalEmpresas: empresas[0].total,
            totalCandidatos: candidatos[0].total,
            totalVagas: vagas[0].total,
            totalFuncionarios: funcionarios[0].total,
            ultimaEmpresa: ultimaEmpresa[0] || null,
            ultimoCandidato: ultimoCandidato[0] || null,
            totalUsuarios: usuarios[0].total,
            totalAdmins: admins[0].total,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: "Erro ao carregar dashboard admin"
        });
    }
}

async function getRelatorios(req, res) {
    try {

        const [empresas] = await db.query(`
            SELECT
                e.id,
                e.nome,
                COUNT(DISTINCT v.id) AS total_vagas,
                COUNT(DISTINCT f.id) AS total_funcionarios
            FROM empresas e
            LEFT JOIN vagas v ON v.empresa_id = e.id
            LEFT JOIN funcionarios f ON f.empresa_id = e.id
            GROUP BY e.id
            ORDER BY total_vagas DESC
        `);

        const [vagas] = await db.query(`
            SELECT
                v.id,
                v.titulo,
                e.nome AS empresa,
                COUNT(c.id) AS candidaturas
            FROM vagas v
            LEFT JOIN empresas e ON e.id = v.empresa_id
            LEFT JOIN candidaturas c ON c.vaga_id = v.id
            GROUP BY v.id
            ORDER BY candidaturas DESC
        `);

        const [contratacoes] = await db.query(`
            SELECT
                e.nome,
                COUNT(f.id) AS total_contratacoes
            FROM funcionarios f
            JOIN empresas e ON e.id = f.empresa_id
            GROUP BY e.id
            ORDER BY total_contratacoes DESC
        `);

        const [resumo] = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM empresas) AS totalEmpresas,
                (SELECT COUNT(*) FROM candidatos) AS totalCandidatos,
                (SELECT COUNT(*) FROM vagas) AS totalVagas,
                (SELECT COUNT(*) FROM funcionarios WHERE status='ativo') AS totalFuncionarios
        `);

        return res.json({
            resumo: resumo[0],
            empresas,
            vagas,
            contratacoes
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            erro: "Erro ao gerar relatórios"
        });
    }
}

// EXPORTAÇÃO CORRETA
module.exports = {
    getDashboardCandidato, getDashboardEmpresa, getDashboardAdmin, getRelatorios
};