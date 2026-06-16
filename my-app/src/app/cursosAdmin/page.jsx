"use client";

import { useEffect, useState } from "react";

export default function GerenciarCursos() {

    const [editandoVideoId, setEditandoVideoId] = useState(null);
    const [urlEditada, setUrlEditada] = useState("");
    const [salvandoEdicao, setSalvandoEdicao] = useState(false);

    const [cursos, setCursos] = useState([]);
    const [videosCurso, setVideosCurso] = useState([]);
    const [cursoSelecionado, setCursoSelecionado] = useState(null);

    const [tituloAula, setTituloAula] = useState("");
    const [urlVideo, setUrlVideo] = useState("");

    const [loadingCursos, setLoadingCursos] = useState(true);
    const [loadingVideos, setLoadingVideos] = useState(false);
    const [enviandoForm, setEnviandoForm] = useState(false);

    const [notificacao, setNotificacao] = useState({ exibir: false, tipo: "", mensagem: "" });

    const mostrarNotificacao = (mensagem, tipo = "danger") => {
        setNotificacao({ exibir: true, tipo, mensagem });
        setTimeout(() => {
            setNotificacao({ exibir: false, tipo: "", mensagem: "" });
        }, 4000);
    };

    useEffect(() => {
        carregarCursos();
    }, []);

    async function carregarCursos() {
        try {
            const resposta = await fetch("http://localhost:3001/api/cursos");
            const dados = await resposta.json();

            if (dados.sucesso && dados.dados) {
                setCursos(dados.dados);
            } else if (Array.isArray(dados)) {
                setCursos(dados);
            } else if (dados.dados && Array.isArray(dados.dados)) {
                setCursos(dados.dados);
            }
        } catch (error) {
            console.error(error);
            mostrarNotificacao("Não foi possível carregar os cursos.");
        } finally {
            setLoadingCursos(false);
        }
    }

    async function abrirCurso(curso) {
        setCursoSelecionado(curso);
        setLoadingVideos(true);

        const cursoId = curso.id || curso._id;

        try {
            const token = localStorage.getItem("token");
            const resposta = await fetch(
                `http://localhost:3001/api/cursos/${cursoId}/videos`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const dados = await resposta.json();

            if (dados.sucesso && dados.dados) {
                setVideosCurso(dados.dados);
            } else if (dados.dados && Array.isArray(dados.dados)) {
                setVideosCurso(dados.dados);
            } else if (Array.isArray(dados)) {
                setVideosCurso(dados);
            } else {
                setVideosCurso([]);
            }
        } catch (error) {
            console.error(error);
            mostrarNotificacao("Erro ao buscar os vídeos desse curso.");
        } finally {
            setLoadingVideos(false);
        }
    }

    async function salvarEdicaoVideo(videoId) {
        if (!urlEditada.trim()) {
            mostrarNotificacao("A URL não pode ficar vazia.");
            return;
        }

        setSalvandoEdicao(true);
        const cursoId = cursoSelecionado.id || cursoSelecionado._id;

        try {
            const token = localStorage.getItem("token");
            const resposta = await fetch(
                `http://localhost:3001/api/cursos/${cursoId}/videos/${videoId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ url_video: urlEditada }),
                }
            );

            const dados = await resposta.json();

            if (resposta.ok || dados.sucesso) {
                mostrarNotificacao("Vídeo atualizado com sucesso!", "success");
                setEditandoVideoId(null);
                setUrlEditada("");
                abrirCurso(cursoSelecionado);
            } else {
                mostrarNotificacao(dados.mensagem || "Erro ao atualizar vídeo.");
            }
        } catch (error) {
            console.error(error);
            mostrarNotificacao("Erro de rede ao tentar editar o vídeo.");
        } finally {
            setSalvandoEdicao(false);
        }
    }

    async function handleSalvarAula(e) {
        e.preventDefault();

        if (!tituloAula.trim() || !urlVideo.trim()) {
            mostrarNotificacao("Por favor, preencha todos os campos.");
            return;
        }

        setEnviandoForm(true);
        const cursoId = cursoSelecionado.id || cursoSelecionado._id;

        try {
            const token = localStorage.getItem("token");
            const resposta = await fetch(
                `http://localhost:3001/api/cursos/${cursoId}/videos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        titulo: tituloAula,
                        tituloAula: tituloAula,
                        url_video: urlVideo,
                        urlVideo: urlVideo,
                        url: urlVideo,
                        curso_id: cursoId,
                        cursoId: cursoId
                    }),
                }
            );

            const dados = await resposta.json();

            if (dados.sucesso || resposta.ok) {
                mostrarNotificacao("Aula adicionada com sucesso!", "success");
                setTituloAula("");
                setUrlVideo("");
                abrirCurso(cursoSelecionado);
            } else {
                mostrarNotificacao(dados.mensagem || "O servidor recusou os dados da aula.");
            }
        } catch (error) {
            console.error(error);
            mostrarNotificacao("Erro de rede ao tentar conectar com o servidor.");
        } finally {
            setEnviandoForm(false);
        }
    }

    if (loadingCursos) {
        return (
            <main id="main-content" className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </main>
        );
    }

    return (
        <>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>MatchHire - Gerenciar Cursos</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

            <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4 mb-0 pb-0">
                {notificacao.exibir && (
                    <div className={`alert alert-${notificacao.tipo} position-fixed top-0 end-0 m-4 z-3 shadow fw-bold`} role="alert">
                        <i className={`bi ${notificacao.tipo === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'} me-2`} />
                        {notificacao.mensagem}
                    </div>
                )}

                <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1 mb-0">
                    <div
                        className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1 mb-0"
                        style={{
                            backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
                            borderRadius: 0,
                            borderTopLeftRadius: 30
                        }}
                    >
                        <div className="col-lg-12 w-100 mb-5 px-0 px-md-3">
                            <div
                                className="p-4 p-md-5 text-dark shadow-lg w-100"
                                style={{ backgroundColor: "#9DC5BB", borderRadius: 24 }}
                            >
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 border-bottom border-dark border-opacity-10 pb-4 gap-4">
                                    <div>
                                        <span className="badge bg-dark rounded-pill px-3 py-1.5 shadow-sm text-white fw-bold mb-3" style={{ fontSize: '0.75rem' }}>
                                            <i className="bi bi-shield-lock-fill me-1 text-success" /> Painel do Administrador
                                        </span>
                                        <h2 className="fw-bold font-georgia mb-2 text-dark">Gerenciar Cursos</h2>
                                        <p className="text-muted mb-0">Selecione um curso na lista para gerenciar sua grade, atualizar URLs ou anexar novos conteúdos de vídeo.</p>
                                    </div>
                                </div>
                                <div className="row g-4">
                                    <div className="col-xl-4">
                                        <div className="card border-0 rounded-4 shadow-sm h-100" style={{ backgroundColor: "#EAF2F0" }}>
                                            <div className="card-body p-4 d-flex flex-column">
                                                <h5 className="fw-bold text-dark font-georgia mb-3 pb-2 border-bottom border-dark border-opacity-10">
                                                    <i className="bi bi-collection-play-fill me-2 text-success" /> Cursos Disponíveis
                                                </h5>
                                                
                                                <div className="flex-grow-1 overflow-auto pe-1" style={{ maxHeight: "550px" }}>
                                                    <div className="d-flex flex-column gap-2">
                                                        {cursos.map((curso) => {
                                                            const idCurso = curso.id || curso._id;
                                                            const isSelected = (cursoSelecionado?.id || cursoSelecionado?._id) === idCurso;
                                                            
                                                            return (
                                                                <button
                                                                    key={idCurso}
                                                                    type="button"
                                                                    className="btn text-start p-3 rounded-3 border-0 d-flex align-items-center justify-content-between w-100 shadow-sm"
                                                                    style={{
                                                                        backgroundColor: isSelected ? "#2a402c" : "#ffffff",
                                                                        color: isSelected ? "#ffffff" : "#212529",
                                                                        transition: "all 0.2s ease"
                                                                    }}
                                                                    onClick={() => abrirCurso(curso)}
                                                                >
                                                                    <div className="fw-medium text-truncate pe-2" style={{ fontSize: "0.95rem" }}>
                                                                        {curso.nome || curso.titulo || `Curso #${idCurso}`}
                                                                    </div>
                                                                    <i className={`bi bi-chevron-right ${isSelected ? "text-success" : "text-muted"} small`} />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-8">
                                        {cursoSelecionado ? (
                                            <div className="d-flex flex-column gap-4">
                                                <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: "#EAF2F0" }}>
                                                    <div className="card-body p-4">
                                                        <h5 className="fw-bold text-dark font-georgia mb-3 pb-2 border-bottom border-dark border-opacity-10">
                                                            <i className="bi bi-list-stars me-2 text-success" /> Grade de Aulas: <span className="text-success fw-bold">{cursoSelecionado.nome || cursoSelecionado.titulo}</span>
                                                        </h5>

                                                        {loadingVideos ? (
                                                            <div className="text-center py-5 text-muted fw-medium">
                                                                <div className="spinner-border spinner-border-sm text-success me-2" role="status" />
                                                                Carregando as aulas vinculadas...
                                                            </div>
                                                        ) : (
                                                            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                                <table className="table table-hover align-middle mb-0" style={{ backgroundColor: "transparent" }}>
                                                                    <thead>
                                                                        <tr className="text-secondary small border-bottom border-dark border-opacity-10">
                                                                            <th className="pb-2 bg-transparent">Título do Conteúdo</th>
                                                                            <th className="text-end pb-2 bg-transparent">Ações</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {videosCurso && videosCurso.length > 0 ? (
                                                                            videosCurso.map((video) => {
                                                                                const videoId = video.id || video._id;
                                                                                const isEditando = editandoVideoId === videoId;

                                                                                return (
                                                                                    <tr key={videoId} className="border-bottom border-dark border-opacity-5">
                                                                                        <td className="text-dark py-3 bg-transparent">
                                                                                            <div className="d-flex flex-column">
                                                                                                <span className="fw-semibold text-dark">
                                                                                                    <i className="bi bi-play-circle-fill text-success me-2" />
                                                                                                    {video.titulo || video.nome}
                                                                                                </span>
                                                                                                
                                                                                                {isEditando ? (
                                                                                                    <div className="mt-2 input-group input-group-sm" style={{ maxWidth: "500px" }}>
                                                                                                        <input
                                                                                                            type="url"
                                                                                                            className="form-control rounded-start"
                                                                                                            value={urlEditada}
                                                                                                            onChange={(e) => setUrlEditada(e.target.value)}
                                                                                                            placeholder="Cole a nova URL de vídeo"
                                                                                                        />
                                                                                                        <button
                                                                                                            className="btn btn-dark fw-bold"
                                                                                                            onClick={() => salvarEdicaoVideo(videoId)}
                                                                                                            disabled={salvandoEdicao}
                                                                                                        >
                                                                                                            {salvandoEdicao ? "..." : "Salvar"}
                                                                                                        </button>
                                                                                                        <button
                                                                                                            className="btn btn-outline-secondary bg-white"
                                                                                                            onClick={() => setEditandoVideoId(null)}
                                                                                                            disabled={salvandoEdicao}
                                                                                                        >
                                                                                                            Cancelar
                                                                                                        </button>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <small className="text-muted mt-1 text-truncate d-block" style={{ maxWidth: "450px" }}>
                                                                                                        URL: <a href={video.url_video} target="_blank" rel="noreferrer" className="text-decoration-none text-success fw-medium">{video.url_video}</a>
                                                                                                    </small>
                                                                                                )}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="text-end py-3 bg-transparent">
                                                                                            {!isEditando && (
                                                                                                <button
                                                                                                    className="btn btn-sm btn-dark px-3 rounded-2 shadow-sm border-0 fw-medium"
                                                                                                    style={{ backgroundColor: "#2a402c" }}
                                                                                                    onClick={() => {
                                                                                                        setEditandoVideoId(videoId);
                                                                                                        setUrlEditada(video.url_video || "");
                                                                                                    }}
                                                                                                >
                                                                                                    <i className="bi bi-pencil-square me-1" /> Editar URL
                                                                                                </button>
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="2" className="text-center py-5 text-muted fw-medium bg-transparent">
                                                                                    <i className="bi bi-info-circle me-1" /> Nenhuma aula vinculada a este curso.
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: "#EAF2F0" }}>
                                                    <div className="card-body p-4">
                                                        <h5 className="fw-bold text-dark font-georgia mb-3 pb-2 border-bottom border-dark border-opacity-10">
                                                            <i className="bi bi-plus-circle-fill me-2 text-success" /> Adicionar Nova Aula
                                                        </h5>
                                                        
                                                        <form onSubmit={handleSalvarAula}>
                                                            <div className="row g-3">
                                                                <div className="col-md-6">
                                                                    <label className="form-label text-dark small fw-bold">Título do Bloco / Aula</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control rounded-3 border-0 shadow-sm p-2.5"
                                                                        value={tituloAula}
                                                                        onChange={(e) => setTituloAula(e.target.value)}
                                                                        placeholder="Ex: Introdução ao Módulo Avançado"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="form-label text-dark small fw-bold">URL Externa do Vídeo</label>
                                                                    <input
                                                                        type="url"
                                                                        className="form-control rounded-3 border-0 shadow-sm p-2.5"
                                                                        value={urlVideo}
                                                                        onChange={(e) => setUrlVideo(e.target.value)}
                                                                        placeholder="https://exemplo.com/video"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="col-12 mt-4 text-end">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-dark px-4 py-2 rounded-3 shadow-sm fw-bold border-0"
                                                                        style={{ backgroundColor: "#2a402c" }}
                                                                        disabled={enviandoForm || !tituloAula.trim() || !urlVideo.trim()}
                                                                    >
                                                                        {enviandoForm ? (
                                                                            <>
                                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                                                                Indexando Vídeo...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="bi bi-cloud-arrow-up-fill me-1" /> Salvar Conteúdo
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>

                                            </div>
                                        ) : (
                                            <div className="card border-0 rounded-4 shadow-sm h-100 d-flex align-items-center justify-content-center p-5" style={{ backgroundColor: "#EAF2F0" }}>
                                                <div className="text-center p-4">
                                                    <i className="bi bi-collection-play text-muted opacity-50" style={{ fontSize: "4.5rem" }} />
                                                    <h4 className="text-dark fw-bold mt-3 font-georgia">Nenhum curso ativo</h4>
                                                    <p className="text-muted mx-auto" style={{ maxWidth: "380px" }}>Selecione uma das opções estruturais na barra lateral esquerda para gerenciar os blocos de aulas.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}