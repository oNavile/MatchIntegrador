"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AreaDoCurso() {
  const params = useParams();
  const router = useRouter();
  const idCurso = params?.id;

  const [loading, setLoading] = useState(true);
  const [curso, setCurso] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoAtual, setVideoAtual] = useState(null);
  const [progresso, setProgresso] = useState(0);
  const [assistidos, setAssistidos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);

  useEffect(() => {
    if (idCurso) {
      carregarDados();
    }
  }, [idCurso]);

  async function carregarDados() {
    try {
      const token = localStorage.getItem("token");

      const [cursoRes, videosRes, progressoRes] = await Promise.all([
        fetch(`http://localhost:3001/api/cursos/${idCurso}`),
        fetch(`http://localhost:3001/api/cursos/${idCurso}/videos`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:3001/api/cursos/${idCurso}/progresso`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const cursoData = await cursoRes.json();
      const videosData = await videosRes.json();
      const progressoData = await progressoRes.json();

      if (cursoData.sucesso) setCurso(cursoData.dados);
      
      if (videosData.sucesso) {
        // Vincula o status de conclusão que veio do progresso para cada vídeo permanentemente
        const listaVideosSincronizada = videosData.dados.map(video => ({
          ...video,
          concluido: progressoData.sucesso && progressoData.videosConcluidosIds 
            ? progressoData.videosConcluidosIds.includes(video.id) 
            : !!video.concluido
        }));

        setVideos(listaVideosSincronizada);
        
        if (listaVideosSincronizada.length > 0) {
          setVideoAtual(listaVideosSincronizada[0]);
        }
      }

      if (progressoData.sucesso) {
        setProgresso(progressoData.progresso);
        setAssistidos(progressoData.assistidos);
        setTotalVideos(progressoData.totalVideos);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function concluirVideo(videoId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/cursos/${idCurso}/videos/${videoId}/concluir`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await response.json();
      if (data.sucesso) {
        setProgresso(data.progresso);
        setAssistidos(data.assistidos);
        setTotalVideos(data.totalVideos);
        
        // Atualiza o estado local na hora do clique de forma permanente
        setVideos(prevVideos => 
          prevVideos.map(v => v.id === videoId ? { ...v, concluido: true } : v)
        );
        
        setVideoAtual(prev => prev && prev.id === videoId ? { ...prev, concluido: true } : prev);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
        <div className="spinner-border text-success" role="status" />
      </main>
    );
  }

  if (!curso) {
    return (
      <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
        <h3 className="fw-bold text-dark">Curso não encontrado</h3>
      </main>
    );
  }

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>MatchHire - Área de Capacitação</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4 mb-0 pb-0">
        <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1 mb-0">
          
          {/* FUNDO GRADIENTE INSTITUCIONAL VERDE ESCURO */}
          <div
            className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1 mb-0"
            style={{
              backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
              borderRadius: 0,
              borderTopLeftRadius: 30
            }}
          >
            <div className="col-lg-12 w-100 mb-5 px-0 px-md-3">
              {/* CONTAINER INTERNO VERDE SÁLVIA MÁRMORE */}
              <div
                className="p-4 p-md-5 text-dark shadow-lg w-100"
                style={{ backgroundColor: "#9DC5BB", borderRadius: 24 }}
              >
                
                {/* CABEÇALHO DO CURSO E PROGRESSO */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 border-bottom border-dark border-opacity-10 pb-4 gap-4">
                  <div>
                    <span className="badge bg-dark rounded-pill px-3 py-1.5 shadow-sm text-white fw-bold mb-3" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-journal-bookmark-fill me-1 text-success" /> Módulo de Capacitação
                    </span>
                    <h2 className="fw-bold font-georgia mb-2 text-dark">{curso.titulo}</h2>
                    <p className="text-muted mb-0">{curso.descricao}</p>
                  </div>

                  {/* CARD DE PROGRESSO */}
                  <div className="card border-0 shadow-sm" style={{ backgroundColor: "#EAF2F0", minWidth: "280px", borderRadius: "16px" }}>
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between mb-2 small fw-bold text-dark">
                        <span>Progresso Geral</span>
                        <span>{progresso}%</span>
                      </div>
                      <div className="progress mb-2" style={{ height: "8px", backgroundColor: "rgba(0,0,0,0.05)" }}>
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${progresso}%` }}
                        />
                      </div>
                      <small className="text-muted fw-medium d-block">
                        <i className="bi bi-check2-circle me-1 text-success" />
                        {assistidos} de {totalVideos} aulas concluídas
                      </small>
                    </div>
                  </div>
                </div>

                {/* CONTEÚDO PRINCIPAL: VÍDEO + GRADE DE AULAS */}
                <div className="row g-4">
                  
                  {/* COLUNA DO PLAYER (ESQUERDA) */}
                  <div className="col-xl-8">
                    <div className="card border-0 bg-black rounded-4 overflow-hidden shadow mb-4">
                      <div className="ratio ratio-16x9">
                        {videoAtual ? (
                          <a 
                            href={videoAtual.url_video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-flex align-items-center justify-content-center text-decoration-none h-100 w-100"
                            style={{ backgroundColor: "#162417" }}
                          >
                            {/* BOTÃO DE PLAY MINIMALISTA */}
                            <div 
                              className="d-flex align-items-center justify-content-center bg-white shadow-sm"
                              style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                transition: "transform 0.2s ease"
                              }}
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              <i className="bi bi-play-fill text-dark" style={{ fontSize: "2.2rem", marginLeft: "4px" }} />
                            </div>
                          </a>
                        ) : (
                          <div className="d-flex align-items-center justify-content-center bg-dark text-muted">
                            <p>Nenhuma aula selecionada</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detalhes da Aula Selecionada */}
                    {videoAtual && (
                      <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: "#EAF2F0" }}>
                        <div className="card-body p-4">
                          <span className="badge bg-dark bg-opacity-10 text-dark fw-bold rounded-pill px-3 py-1 mb-2 small">
                            Aula Atual • {videoAtual.ordem}º Bloco
                          </span>
                          <h4 className="fw-bold mb-2 text-dark font-georgia">{videoAtual.titulo}</h4>
                          <p className="text-secondary small mb-4">{videoAtual.descricao || "Sem descrição disponível para esta aula."}</p>
                          
                          <button
                            className="btn btn-dark d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm fw-bold border-0"
                            style={{ 
                              backgroundColor: videoAtual.concluido ? "#1a301c" : "#2a402c",
                              cursor: videoAtual.concluido ? "not-allowed" : "pointer" 
                            }}
                            onClick={() => concluirVideo(videoAtual.id)}
                            disabled={videoAtual.concluido}
                          >
                            <i className="bi bi-patch-check-fill text-success" /> 
                            {videoAtual.concluido ? "Aula Concluída ✔" : "Marcar Conclusão de Aula"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COLUNA DO ÍNDICE DE CONTEÚDOS (DIREITA) */}
                  <div className="col-xl-4">
                    <div className="card border-0 rounded-4 shadow-sm h-100" style={{ backgroundColor: "#EAF2F0" }}>
                      <div className="card-body p-4 d-flex flex-column">
                        <h5 className="fw-bold text-dark font-georgia mb-3 pb-2 border-bottom border-dark border-opacity-10">
                          <i className="bi bi-list-stars me-2 text-success" /> Grade de Conteúdos
                        </h5>
                        
                        {/* Lista de Aulas */}
                        <div className="flex-grow-1 overflow-auto pe-1" style={{ maxHeight: "400px" }}>
                          <div className="d-flex flex-column gap-2">
                            {videos.map((video) => {
                              const isSelected = videoAtual?.id === video.id;
                              
                              return (
                                <button
                                  key={video.id}
                                  className="btn text-start p-3 rounded-3 border-0 d-flex flex-column gap-1 w-100 shadow-sm"
                                  style={{
                                    backgroundColor: isSelected ? "#2a402c" : "#ffffff",
                                    color: isSelected ? "#ffffff" : "#212529",
                                    transition: "all 0.2s ease"
                                  }}
                                  onClick={() => setVideoAtual(video)}
                                >
                                  <div className="d-flex justify-content-between align-items-center w-100">
                                    <div className={`fw-bold small ${isSelected ? "text-success" : "text-muted"}`}>
                                      CONTEÚDO {video.ordem}
                                    </div>
                                  </div>
                                  <div className="fw-medium text-truncate w-100" style={{ fontSize: "0.95rem" }}>
                                    {video.titulo}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Botão de Retorno */}
                        <button
                          className="btn btn-outline-dark mt-4 w-100 rounded-3 fw-medium bg-white bg-opacity-50"
                          onClick={() => router.push("../")}
                        >
                          <i className="bi bi-arrow-left me-2" /> Voltar ao Painel Principal
                        </button>
                      </div>
                    </div>
                  </div>

                </div> {/* Fim da Row */}

              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}