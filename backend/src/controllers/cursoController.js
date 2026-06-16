const db = require('../config/database');

exports.listarCursos = async (req, res) => {
  try {
    const [cursos] = await db.query(`
      SELECT *
      FROM cursos
      WHERE ativo = 1
      ORDER BY criado_em DESC
    `);

    res.json({
      sucesso: true,
      dados: cursos
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar cursos'
    });
  }
};

exports.buscarCurso = async (req, res) => {
  try {
    const [[curso]] = await db.query(
      `
      SELECT *
      FROM cursos
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (!curso) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Curso não encontrado'
      });
    }

    res.json({
      sucesso: true,
      dados: curso
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar curso'
    });
  }
};

exports.comprarCurso = async (req, res) => {
  try {

    if (req.usuario.tipo !== 'candidato') {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Apenas candidatos podem comprar cursos'
      });
    }

    const [[curso]] = await db.query(
      `
      SELECT *
      FROM cursos
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (!curso) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Curso não encontrado'
      });
    }

    const [[candidato]] = await db.query(
      `
      SELECT id
      FROM candidatos
      WHERE usuario_id = ?
      `,
      [req.usuario.id]
    );

    if (!candidato) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Candidato não encontrado'
      });
    }

    const [[compraExistente]] = await db.query(
      `
      SELECT id
      FROM compras_cursos
      WHERE candidato_id = ?
        AND curso_id = ?
        AND status = 'aprovado'
      `,
      [candidato.id, curso.id]
    );

    if (compraExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Curso já adquirido'
      });
    }

    await db.query(
      `
      INSERT INTO compras_cursos
      (
        candidato_id,
        curso_id,
        tipo,
        valor_pago,
        status
      )
      VALUES
      (
        ?,
        ?,
        'curso',
        ?,
        'aprovado'
      )
      `,
      [
        candidato.id,
        curso.id,
        curso.valor
      ]
    );

    res.json({
      sucesso: true,
      mensagem: 'Curso adquirido com sucesso'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao comprar curso'
    });
  }
};

exports.comprarPlano = async (req, res) => {
  try {

    if (req.usuario.tipo !== 'candidato') {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Apenas candidatos podem adquirir planos'
      });
    }

    const [[candidato]] = await db.query(
      `
      SELECT id
      FROM candidatos
      WHERE usuario_id = ?
      `,
      [req.usuario.id]
    );

    if (!candidato) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Candidato não encontrado'
      });
    }

    const [[planoExistente]] = await db.query(
      `
      SELECT id
      FROM compras_cursos
      WHERE candidato_id = ?
        AND tipo = 'plano_completo'
        AND status = 'aprovado'
      `,
      [candidato.id]
    );

    if (planoExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Plano já adquirido'
      });
    }

    await db.query(
      `
      INSERT INTO compras_cursos
      (
        candidato_id,
        tipo,
        valor_pago,
        status
      )
      VALUES
      (
        ?,
        'plano_completo',
        99.90,
        'aprovado'
      )
      `,
      [candidato.id]
    );

    res.json({
      sucesso: true,
      mensagem: 'Plano completo adquirido'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao adquirir plano'
    });
  }
};

exports.listarVideos = async (req, res) => {
  try {

    const [videos] = await db.query(
      `
      SELECT *
      FROM videos_curso
      WHERE curso_id = ?
      ORDER BY ordem ASC
      `,
      [req.params.id]
    );

    res.json({
      sucesso: true,
      dados: videos
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar vídeos'
    });
  }
};

exports.concluirVideo = async (req, res) => {
  try {

    const [[candidato]] = await db.query(
      `
      SELECT id
      FROM candidatos
      WHERE usuario_id = ?
      `,
      [req.usuario.id]
    );

    if (!candidato) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Candidato não encontrado'
      });
    }

    await db.query(
      `
      INSERT IGNORE INTO progresso_cursos
      (
        candidato_id,
        curso_id,
        video_id,
        concluido
      )
      VALUES
      (
        ?,
        ?,
        ?,
        1
      )
      `,
      [
        candidato.id,
        req.params.id,
        req.params.videoId
      ]
    );

    const [[assistidos]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM progresso_cursos
      WHERE candidato_id = ?
        AND curso_id = ?
      `,
      [
        candidato.id,
        req.params.id
      ]
    );

    const [[videos]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM videos_curso
      WHERE curso_id = ?
      `,
      [req.params.id]
    );

    const progresso =
      videos.total === 0
        ? 0
        : Math.round(
            (assistidos.total / videos.total) * 100
          );

    res.json({
      sucesso: true,
      mensagem: 'Vídeo concluído',
      assistidos: assistidos.total,
      totalVideos: videos.total,
      progresso
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao concluir vídeo'
    });
  }
};

exports.progresso = async (req, res) => {
  try {

    if (
      req.usuario.tipo === 'empresa' ||
      req.usuario.tipo === 'admin'
    ) {
      return res.json({
        sucesso: true,
        assistidos: 4,
        totalVideos: 4,
        progresso: 100
      });
    }

    const [[candidato]] = await db.query(
      `
      SELECT id
      FROM candidatos
      WHERE usuario_id = ?
      `,
      [req.usuario.id]
    );

    if (!candidato) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Candidato não encontrado'
      });
    }

    const [[assistidos]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM progresso_cursos
      WHERE candidato_id = ?
        AND curso_id = ?
      `,
      [
        candidato.id,
        req.params.id
      ]
    );

    const [[videos]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM videos_curso
      WHERE curso_id = ?
      `,
      [req.params.id]
    );

    const progresso =
      videos.total === 0
        ? 0
        : Math.round(
            (assistidos.total / videos.total) * 100
          );

    res.json({
      sucesso: true,
      assistidos: assistidos.total,
      totalVideos: videos.total,
      progresso
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao consultar progresso'
    });
  }
};

exports.meusCursos = async (req, res) => {
  try {

    const [[candidato]] = await db.query(
      `
      SELECT id
      FROM candidatos
      WHERE usuario_id = ?
      `,
      [req.usuario.id]
    );

    if (!candidato) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Candidato não encontrado'
      });
    }

    const [cursos] = await db.query(
      `
      SELECT curso_id
      FROM compras_cursos
      WHERE candidato_id = ?
        AND status = 'aprovado'
      `,
      [candidato.id]
    );

    res.json({
      sucesso: true,
      dados: cursos
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar cursos do candidato'
    });
  }
};