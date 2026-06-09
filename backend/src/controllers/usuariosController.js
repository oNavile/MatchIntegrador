const db = require("../config/database");

const listarUsuarios = async (req, res) => {
    try {

        const [usuarios] = await db.query(`
            SELECT
                id,
                email,
                tipo,
                ativo,
                criado_em
            FROM usuarios
            ORDER BY id DESC
        `);

        res.json(usuarios);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: "Erro ao listar usuários."
        });
    }
};

const buscarUsuario = async (req, res) => {
    try {

        const [usuario] = await db.query(
            `
            SELECT
                id,
                email,
                tipo,
                ativo
            FROM usuarios
            WHERE id = ?
            `,
            [req.params.id]
        );

        if (!usuario.length) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        res.json(usuario[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: "Erro ao buscar usuário."
        });
    }
};

const editarUsuario = async (req, res) => {
    try {

        const { email, tipo, ativo } = req.body;

        await db.query(
            `
            UPDATE usuarios
            SET
                email = ?,
                tipo = ?,
                ativo = ?
            WHERE id = ?
            `,
            [
                email,
                tipo,
                ativo,
                req.params.id
            ]
        );

        res.json({
            mensagem: "Usuário atualizado."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: "Erro ao atualizar usuário."
        });
    }
};

const excluirUsuario = async (req, res) => {
    try {

        await db.query(
            `
            DELETE FROM usuarios
            WHERE id = ?
            `,
            [req.params.id]
        );

        res.json({
            mensagem: "Usuário removido."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: "Erro ao excluir usuário."
        });
    }
};

module.exports = {
   listarUsuarios,
   buscarUsuario,
   editarUsuario,
   excluirUsuario
};