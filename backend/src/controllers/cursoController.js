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

    if (
      req.usuario.tipo !== "candidato" &&
      req.usuario.tipo !== "empresa"
    ) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Perfil sem permissão para comprar cursos"
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
        mensagem: "Curso não encontrado"
      });
    }

    let compradorId;
    let campoBanco;

    if (req.usuario.tipo === "candidato") {

      const [[candidato]] = await db.query(
        `
        SELECT id
        FROM candidatos
        WHERE usuario_id = ?
        `,
        [req.usuario.id]
      );

      compradorId = candidato.id;
      campoBanco = "candidato_id";

    } else {

      const [[empresa]] = await db.query(
        `
        SELECT id
        FROM empresas
        WHERE usuario_id = ?
        `,
        [req.usuario.id]
      );

      if (!empresa) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Empresa não encontrada"
        });
      }

      compradorId = empresa.id;
      campoBanco = "empresa_id";
    }

    const [[compraExistente]] = await db.query(
      `
SELECT id
FROM compras_cursos
WHERE ${campoBanco} = ?
AND curso_id = ?
AND status = 'aprovado'
`,
      [
        compradorId,
        curso.id
      ]
    );

    if (compraExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Curso já adquirido"
      });
    }

    await db.query(
      `
INSERT INTO compras_cursos
(
  ${campoBanco},
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
        compradorId,
        curso.id,
        curso.valor
      ]
    );

    res.json({
      sucesso: true,
      mensagem: "Curso adquirido com sucesso"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao comprar curso"
    });
  }
};

exports.comprarPlano = async (req, res) => {
  try {

    if (
      req.usuario.tipo !== "candidato" &&
      req.usuario.tipo !== "empresa"
    ) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Perfil sem permissão para adquirir planos"
      });
    }

    let compradorId;
    let campoBanco;

    if (req.usuario.tipo === "candidato") {

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
          mensagem: "Candidato não encontrado"
        });
      }

      compradorId = candidato.id;
      campoBanco = "candidato_id";

    } else {

      const [[empresa]] = await db.query(
        `
        SELECT id
        FROM empresas
        WHERE usuario_id = ?
        `,
        [req.usuario.id]
      );

      if (!empresa) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Empresa não encontrada"
        });
      }

      compradorId = empresa.id;
      campoBanco = "empresa_id";
    }

    const [[planoExistente]] = await db.query(
      `
      SELECT id
      FROM compras_cursos
      WHERE ${campoBanco} = ?
      AND tipo = 'plano_completo'
      AND status = 'aprovado'
      `,
      [compradorId]
    );

    if (planoExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Plano já adquirido"
      });
    }

    await db.query(
      `
      INSERT INTO compras_cursos
      (
        ${campoBanco},
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
      [compradorId]
    );

    res.json({
      sucesso: true,
      mensagem: "Plano completo adquirido"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao adquirir plano"
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

    let compradorId;
    let tipoComprador;

    if (req.usuario.tipo === "candidato") {

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
          mensagem: "Candidato não encontrado"
        });
      }

      compradorId = candidato.id;
      tipoComprador = "candidato";

    } else if (req.usuario.tipo === "empresa") {

      const [[empresa]] = await db.query(
        `
        SELECT id
        FROM empresas
        WHERE usuario_id = ?
        `,
        [req.usuario.id]
      );

      if (!empresa) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Empresa não encontrada"
        });
      }

      compradorId = empresa.id;
      tipoComprador = "empresa";

    } else {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Perfil sem permissão"
      });
    }

    await db.query(
      `
      INSERT IGNORE INTO progresso_cursos
      (
        comprador_id,
        tipo_comprador,
        curso_id,
        video_id,
        concluido
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        1
      )
      `,
      [
        compradorId,
        tipoComprador,
        req.params.id,
        req.params.videoId
      ]
    );

    const [[assistidos]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM progresso_cursos
      WHERE comprador_id = ?
      AND tipo_comprador = ?
      AND curso_id = ?
      `,
      [
        compradorId,
        tipoComprador,
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
      mensagem: "Vídeo concluído",
      assistidos: assistidos.total,
      totalVideos: videos.total,
      progresso
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao concluir vídeo"
    });
  }
};

exports.progresso = async (req, res) => {
  try {

    let compradorId;
    let tipoComprador;

    if (req.usuario.tipo === "candidato") {

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
          mensagem: "Candidato não encontrado"
        });
      }

      compradorId = candidato.id;
      tipoComprador = "candidato";

    } else if (req.usuario.tipo === "empresa") {

      const [[empresa]] = await db.query(
        `
        SELECT id
        FROM empresas
        WHERE usuario_id = ?
        `,
        [req.usuario.id]
      );

      if (!empresa) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Empresa não encontrada"
        });
      }

      compradorId = empresa.id;
      tipoComprador = "empresa";

    } else {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Perfil sem permissão"
      });
    }

    const [[assistidos]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM progresso_cursos
      WHERE comprador_id = ?
      AND tipo_comprador = ?
      AND curso_id = ?
      `,
      [
        compradorId,
        tipoComprador,
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
      mensagem: "Erro ao consultar progresso"
    });
  }
};

exports.meusCursos = async (req, res) => {
  try {

    let compradorId;
    let campoBanco;

    if (req.usuario.tipo === "candidato") {

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
          mensagem: "Candidato não encontrado"
        });
      }

      compradorId = candidato.id;
      campoBanco = "candidato_id";

    } else if (req.usuario.tipo === "empresa") {

      const [[empresa]] = await db.query(
        `
        SELECT id
        FROM empresas
        WHERE usuario_id = ?
        `,
        [req.usuario.id]
      );

      if (!empresa) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Empresa não encontrada"
        });
      }

      compradorId = empresa.id;
      campoBanco = "empresa_id";

    } else {

      return res.status(403).json({
        sucesso: false,
        mensagem: "Perfil sem permissão"
      });

    }

    const [cursos] = await db.query(
      `
      SELECT curso_id
      FROM compras_cursos
      WHERE ${campoBanco} = ?
      AND status = 'aprovado'
      `,
      [compradorId]
    );

    res.json({
      sucesso: true,
      dados: cursos
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar cursos"
    });
  }
};

exports.adicionarVideo = async (req, res) => {
  try {
    const cursoId = req.params.id;
    
    const { titulo, url_video } = req.body;

    if (!titulo || !url_video) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Título e URL do vídeo são obrigatórios.'
      });
    }

    const [[maxOrdem]] = await db.query(
      `SELECT COALESCE(MAX(ordem), 0) + 1 AS proxima FROM videos_curso WHERE curso_id = ?`,
      [cursoId]
    );
    const proximaOrdem = maxOrdem.proxima;

    await db.query(
      `
      INSERT INTO videos_curso (curso_id, titulo, url_video, ordem)
      VALUES (?, ?, ?, ?)
      `,
      [cursoId, titulo, url_video, proximaOrdem]
    );

    res.json({
      sucesso: true,
      mensagem: 'Aula adicionada com sucesso!'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao salvar a aula no banco de dados'
    });
  }
};

exports.atualizarVideo = async (req, res) => {
  try {
    const cursoId = req.params.id;
    const videoId = req.params.videoId;
    const { url_video } = req.body;

    if (!url_video) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'A nova URL do vídeo é obrigatória.'
      });
    }
    await db.query(
      `
      UPDATE videos_curso 
      SET url_video = ? 
      WHERE id = ? AND curso_id = ?
      `,
      [url_video, videoId, cursoId]
    );

    res.json({
      sucesso: true,
      mensagem: 'URL do vídeo atualizada com sucesso!'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao atualizar o vídeo.'
    });
  }
};