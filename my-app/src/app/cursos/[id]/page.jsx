"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AreaDoCurso() {
  const params = useParams();
  const router = useRouter();
  const idCurso = params?.id;

  // Estados de controle da página
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subAba, setSubAba] = useState("anotacoes"); // Controla o painel inferior

  // Estados da Aula Ativa e Progresso
  const [aulaAtiva, setAulaAtiva] = useState(null);
  const [aulasConcluidas, setAulasConcluidas] = useState([]); // IDs das aulas vistas

  // Estados das Anotações Pessoais
  const [anotacao, setAnotacao] = useState("");
  const [statusAnotacao, setStatusAnotacao] = useState("Salvar Anotação");

  useEffect(() => {
    if (idCurso) {
      buscarCurso();
    }
  }, [idCurso]);

  async function buscarCurso() {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/cursos/${idCurso}`
      );
      const data = await response.json();

      if (!data.sucesso) {
        setCurso(null);
        return;
      }

      const cursoCarregado = data.dados;
      setCurso(cursoCarregado);

      // Puxa o primeiro vídeo da lista (vinda do banco)
      const primeiraAula = cursoCarregado?.videos?.[0] || null;
      setAulaAtiva(primeiraAula);

    } catch (error) {
      console.error("Erro ao buscar curso:", error);
    } finally {
      setLoading(false);
    }
  }

  // Função para converter links encurtados do YouTube em Embed (necessário para Iframe)
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    return url;
  };

  // Alternar conclusão de uma aula
  const alternarConclusaoAula = (id) => {
    if (!id) return;
    if (aulasConcluidas.includes(id)) {
      setAulasConcluidas(aulasConcluidas.filter(item => item !== id));
    } else {
      setAulasConcluidas([...aulasConcluidas, id]);
    }
  };

  // Salvar anotações com feedback visual no botão
  const salvarAnotacaoLocal = (e) => {
    e.preventDefault();
    setStatusAnotacao("💾 Salvando...");
    setTimeout(() => {
      setStatusAnotacao("✅ Anotação Salva!");
      setTimeout(() => setStatusAnotacao("Salvar Anotação"), 2000);
    }, 1000);
  };

  // Cálculos de progresso (Lógica corrigida para o seu Banco de Dados)
  const totalAulas = curso?.videos?.length || 0;
  const percentualProgresso = totalAulas > 0 ? Math.round((aulasConcluidas.length / totalAulas) * 100) : 0;
  const videosLista = curso?.videos || [];

  if (loading) {
    return (
      <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando Sala de Aula...</span>
        </div>
      </main>
    );
  }

  if (!curso) {
    return (
      <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
        <div className="text-center text-muted p-5 bg-white rounded-4 shadow">
          <h3>Curso não encontrado.</h3>
          <button className="btn btn-success mt-3" onClick={() => router.push('/painel-candidato')}>Voltar ao Painel</button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4">
      <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
        <div
          className="p-4 p-md-5 shadow-lg text-white cor-main d-flex flex-column flex-grow-1"
          style={{ borderRadius: "0", borderTopLeftRadius: "30px" }}
        >
          
          {/* CABEÇALHO DO CURSO E BARRA DE PROGRESSO (AJEITADO) */}
          <div className="row align-items-center mb-4 g-3">
            <div className="col-12 col-md-7">
              <span className="badge bg-success bg-opacity-20 text-success mb-2 px-3 py-2 rounded-pill fw-semibold">
                Área de Aperfeiçoamento
              </span>
              <h1 className="display-6 fw-bold mb-1">{curso.titulo}</h1>
              <p className="text-white-50 small mb-0 d-none d-md-block">{curso.descricao}</p>
            </div>
            
            {/* Bloco de Progresso Estilizado igual anteriores */}
            <div className="col-12 col-md-5">
              <div className="card border-0 p-3 rounded-4 shadow-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div className="d-flex justify-content-between text-white text-opacity-75 small mb-2 fw-semibold">
                  <span>Seu progresso</span>
                  <span>{percentualProgresso}%</span>
                </div>
                <div className="progress rounded-pill" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div 
                    className="progress-bar bg-success rounded-pill" 
                    role="progressbar" 
                    style={{ width: `${percentualProgresso}%`, transition: "width 0.5s" }}
                  ></div>
                </div>
                <div className="text-white-50 small mt-2 d-flex justify-content-between" style={{ fontSize: '0.75rem' }}>
                  <span>{aulasConcluidas.length} aulas concluídas</span>
                  <span>Total: {totalAulas}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 flex-grow-1">
            
            {/* COLUNA ESQUERDA: VideoPlayer + Workspace (Anotações/Chat) (AJEITADO) */}
            <div className="col-12 col-lg-8">
              
              {/* Box do Player de Vídeo com Estilo Moderno */}
              <div className="card border-0 bg-black rounded-4 overflow-hidden shadow mb-3 position-relative">
                <div className="ratio ratio-16x9">
                  {aulaAtiva?.url_video ? (
                    <iframe
                      src={getEmbedUrl(aulaAtiva.url_video)}
                      title={aulaAtiva.titulo}
                      allowFullScreen
                      className="w-100 h-100"
                    ></iframe>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-white-50 bg-dark">
                      Selecione uma aula na lista ao lado.
                    </div>
                  )}
                </div>
              </div>

              {/* Título da Aula e Ação Concluir - Barra de Ação Estilizada */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 bg-white bg-opacity-5 p-3 rounded-4">
                <div>
                  <h4 className="fw-bold mb-0 text-white">{aulaAtiva?.titulo || "Selecione a aula"}</h4>
                  <span className="text-white-50 small">Assista ao vídeo para liberar a marcação.</span>
                </div>
                <button
                  type="button"
                  className={`btn rounded-3 fw-bold px-4 text-uppercase ${aulasConcluidas.includes(aulaAtiva?.id) ? "btn-success" : "btn-outline-success text-white"}`}
                  onClick={() => alternarConclusaoAula(aulaAtiva?.id)}
                  disabled={!aulaAtiva}
                >
                  {aulasConcluidas.includes(aulaAtiva?.id) ? "✓ Concluída" : "Marcar como Concluída"}
                </button>
              </div>

              {/* SELETOR DE SUB-ABAS (Notas, Detalhes) (AJEITADO igual anteriores) */}
              <div className="card border-0 rounded-4 bg-white text-dark shadow-sm overflow-hidden mb-4">
                <div className="card-header bg-light border-0 p-1">
                  <div className="row g-1">
                    <div className="col-6">
                      <button 
                        type="button" 
                        className={`btn w-100 border-0 rounded-3 py-2 fw-semibold ${subAba === "anotacoes" ? "bg-white shadow-sm text-dark fw-bold" : "text-secondary"}`}
                        onClick={() => setSubAba("anotacoes")}
                      >
                        📝 Anotações Pessoais
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        type="button" 
                        className={`btn w-100 border-0 rounded-3 py-2 fw-semibold ${subAba === "detalhes" ? "bg-white shadow-sm text-dark fw-bold" : "text-secondary"}`}
                        onClick={() => setSubAba("detalhes")}
                      >
                        ℹ️ Detalhes do Vídeo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-body p-4 min-vh-25">
                  {/* CONTEÚDO SUB-ABA 1: Anotações */}
                  {subAba === "anotacoes" && (
                    <form onSubmit={salvarAnotacaoLocal} className="animation-fade d-flex flex-column h-100">
                      <h6 className="fw-bold text-secondary text-uppercase tracking-wider mb-2">O que você aprendeu nessa aula?</h6>
                      <textarea
                        className="form-control rounded-3 bg-light border-0 mb-3 flex-grow-1"
                        rows="5"
                        placeholder="Escreva aqui os insights, códigos importantes ou dúvidas aprendidos hoje..."
                        value={anotacao}
                        onChange={(e) => setAnotacao(e.target.value)}
                      ></textarea>
                      <button type="submit" className="btn btn-dark btn-sm px-4 rounded-3 fw-semibold align-self-start">
                        {statusAnotacao}
                      </button>
                    </form>
                  )}

                  {/* CONTEÚDO SUB-ABA 2: Detalhes */}
                  {subAba === "detalhes" && (
                    <div className="animation-fade">
                      <h6 className="fw-bold text-secondary text-uppercase tracking-wider">Descrição da Aula</h6>
                      <p className="mb-0 text-muted">
                        {aulaAtiva?.descricao || "Esta aula não possui descrição detalhada cadastrada."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: Playlist de Aulas (AJEITADO igual anteriores) */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 rounded-4 shadow-sm h-100 bg-white text-dark">
                <div className="card-body p-4 d-flex flex-column h-100">
                  <h5 className="fw-bold mb-3 text-uppercase tracking-wide text-secondary" style={{ fontSize: "0.85rem" }}>
                    Conteúdo do Curso
                  </h5>

                  {/* Lista de Aulas Estilizada */}
                  <div className="overflow-y-auto flex-grow-1 pe-1" style={{ maxHeight: "600px" }}>
                    <div className="list-group rounded-3 shadow-sm border-0 gap-1">
                      {videosLista.length > 0 ? (
                        videosLista.map((video) => {
                          const estaAtiva = video.id === aulaAtiva?.id;
                          const estaConcluida = aulasConcluidas.includes(video.id);
                          
                          return (
                            <button
                              key={video.id}
                              type="button"
                              className={`list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 p-3 rounded-3 ${estaAtiva ? "text-white" : "bg-light text-dark"}`}
                              style={estaAtiva ? { backgroundColor: "#1e293b" } : {}}
                              onClick={() => setAulaAtiva(video)}
                            >
                              {/* Ícone Dinâmico (Play, Check ou Ativo) */}
                              <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "35px", height: "35px", backgroundColor: estaAtiva ? "#9DC5BB" : (estaConcluida ? "#198754" : "rgba(0,0,0,0.05)"), color: estaAtiva ? "#1e293b" : "white" }}>
                                {estaAtiva ? "🎧" : (estaConcluida ? "✓" : "▶")}
                              </div>
                              
                              <div className="lh-sm flex-grow-1">
                                <div className={`fw-semibold ${estaAtiva ? "" : "text-dark"}`} style={{ fontSize: '0.9rem' }}>{video.titulo}</div>
                                {estaAtiva && (
                                  <span className="small text-white-50">Reproduzindo...</span>
                                )}
                              </div>

                              {estaConcluida && !estaAtiva && (
                                <span className="text-success small fw-bold">Visto</span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-center text-muted py-4 small">Nenhum vídeo cadastrado.</div>
                      )}
                    </div>
                  </div>

                  {/* Botão de Saída Inferior */}
                  <div className="mt-4 pt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-dark w-100 py-2 rounded-3 fw-bold"
                      onClick={() => router.push("/painel-candidato")}
                    >
                      Voltar ao Painel de Cursos
                    </button>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}