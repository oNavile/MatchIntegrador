"use client";

import { useState, useEffect } from 'react';

export default function Vagas() {
  // ── ESTADOS DOS DADOS DA API ─────────────────────────────────
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // ── ESTADOS DE FILTRAGEM E BUSCA ────────────────────────────
  const [busca, setBusca] = useState("");
  const [localidadeSelect, setLocalidadeSelect] = useState("todos");
  const [modalidadeFiltro, setModalidadeFiltro] = useState("todos");
  const [senioridadeFiltro, setSenioridadeFiltro] = useState("todos");
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState([]);

  // ── ESTADO DO MODAL SELECIONADO ─────────────────────────────
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [candidaturaStatus, setCandidaturaStatus] = useState({ loading: false, msg: "", erro: false, matchScore: null });

  // ── REQUISIÇÃO PARA O SEU BACKEND (PORTA 3001) ───────────────
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        setLoading(true);
        setErro(null);
        const token = localStorage.getItem('token');

        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // 1. Carrega a lista de vagas
        const responseVagas = await fetch('http://localhost:3001/api/vagas', {
          method: 'GET',
          headers: headers,
          cache: 'no-store'
        });

        if (!responseVagas.ok) {
          throw new Error('Não foi possível obter a lista de vagas do servidor.');
        }

        const dadosVagas = await responseVagas.json();
        setVagas(dadosVagas);

        // 2. SE o usuário estiver logado, já busca os favoritos dele no banco
        if (token) {
          const responseFavs = await fetch('http://localhost:3001/api/favoritos', {
            method: 'GET',
            headers: headers
          });
          
          if (responseFavs.ok) {
            const dadosFavs = await responseFavs.json();
            setFavoritos(dadosFavs); // Define o array de IDs vindos do banco
          }
        }

      } catch (err) {
        console.error(err);
        setErro(err.message || "Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    }
    carregarDadosIniciais();
  }, []);

  // ── LÓGICA DE POST DE CANDIDATURA ────────────────────────────
  const handleCandidatar = async (vagaId) => {
    try {
      setCandidaturaStatus({ loading: true, msg: "", erro: false, matchScore: null });
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Você precisa estar logado para se candidatar.');
      }

      const response = await fetch('http://localhost:3001/api/candidaturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vaga_id: vagaId })
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.erro || 'Erro ao realizar candidatura.');
      }

      setCandidaturaStatus({
        loading: false,
        msg: `Inscrição confirmada com sucesso!`,
        erro: false,
        matchScore: dados.score_match !== undefined ? dados.score_match : 0
      });
    } catch (err) {
      setCandidaturaStatus({ loading: false, msg: err.message, erro: true, matchScore: null });
    }
  };

  // ── ALTERNAR FAVORITOS COM O BACKEND ─────────────────────────
  const alternarFavorito = async (id) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Você precisa estar logado para favoritar uma vaga.');
        return;
      }

      // Envia a requisição para o banco de dados
      const response = await fetch('http://localhost:3001/api/favoritos/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Passa o token para o back saber quem você é
        },
        body: JSON.stringify({ vaga_id: id })
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.erro || 'Erro ao atualizar favorito.');
      }

      // Se o back-end respondeu que deu certo, atualizamos a tela na hora:
      if (dados.acao === 'adicionado') {
        setFavoritos([...favoritos, id]);
      } else if (dados.acao === 'removido') {
        setFavoritos(favoritos.filter(favId => favId !== id));
      }
    } catch (err) {
      console.error("Erro ao alternar favorito:", err);
    }
  };

  // ── PROCESSAMENTO DE FILTROS NA LISTA ────────────────────────
  const vagasFiltradas = vagas.filter((vaga) => {
    const matchesBusca =
      vaga.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
      vaga.empresa_nome?.toLowerCase().includes(busca.toLowerCase()) ||
      vaga.descricao?.toLowerCase().includes(busca.toLowerCase());

    let matchesLocal = true;
    if (localidadeSelect === "sp") matchesLocal = vaga.local?.toLowerCase().includes("sp") || vaga.local?.toLowerCase().includes("são paulo");
    else if (localidadeSelect === "rj") matchesLocal = vaga.local?.toLowerCase().includes("rj") || vaga.local?.toLowerCase().includes("rio");
    else if (localidadeSelect === "remoto") matchesLocal = vaga.tipo === "remoto" || vaga.local?.toLowerCase().includes("remoto");

    const matchesModalidade = modalidadeFiltro === "todos" || vaga.tipo === modalidadeFiltro;

    let matchesSenioridade = true;
    if (senioridadeFiltro !== "todos") {
      const termo = senioridadeFiltro.toLowerCase();
      const tags = Array.isArray(vaga.tags_vaga) ? vaga.tags_vaga : [];
      const naPChave = tags.some(p => p.toLowerCase().includes(termo));
      const noTitulo = vaga.titulo?.toLowerCase().includes(termo);
      matchesSenioridade = naPChave || noTitulo;
    }

    const matchesFavoritos = !mostrarFavoritos || favoritos.includes(vaga.id);

    return matchesBusca && matchesLocal && matchesModalidade && matchesSenioridade && matchesFavoritos;
  });

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>MatchHire - Vagas Disponíveis</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      <link rel="stylesheet" href="style.css" />

      {/* CONTEÚDO DA PÁGINA */}
      <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4">
        <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
          <div className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1" style={{ backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)", borderRadius: 0, borderTopLeftRadius: 30 }}>
            <div className="row w-100 mx-0">
              <div className="col-12 px-0">

                <div className="mb-4">
                  <h1 className="font-georgia fw-bold text-white mb-2">Encontre seu Match Profissional</h1>
                  <p className="text-white-50 fs-5">Milhares de vagas integradas e atualizadas em tempo real.</p>
                </div>

                {/* BARRA DE PESQUISA INTEGRADA */}
                <div className="barra-de-pesquisa-vagas d-flex flex-column flex-md-row align-items-md-center mb-4">
                  <div className="d-flex align-items-center flex-fill px-3 py-2 py-md-0">
                    <i className="bi bi-search text-muted fs-5" />
                    <input type="text" className="form-control text-dark" placeholder="Cargo, tecnologia ou empresa..." value={busca} onChange={(e) => setBusca(e.target.value)} />
                  </div>
                  <div className="search-divider d-none d-md-block" />
                  <div className="d-flex align-items-center flex-fill px-3 py-2 py-md-0 border-md-0 mt-2 mt-md-0">
                    <i className="bi bi-geo-alt text-muted fs-5" />
                    <select className="form-select text-dark border-0 shadow-none" value={localidadeSelect} onChange={(e) => setLocalidadeSelect(e.target.value)}>
                      <option value="todos">Qualquer localidade</option>
                      <option value="sp">São Paulo, SP</option>
                      <option value="rj">Rio de Janeiro, RJ</option>
                      <option value="remoto">100% Remoto</option>
                    </select>
                  </div>
                  <div className="px-2 pb-2 pb-md-0 pt-2 pt-md-0 mt-2 mt-md-0 w-100" style={{ maxWidth: 150 }}>
                    <button className="btn w-100 rounded-pill text-white fw-bold py-2" style={{ backgroundColor: "var(--cor-main)" }}>Buscar</button>
                  </div>
                </div>

                {/* ABA DE FILTROS MODALIDADE */}
                <div className="d-flex gap-2 flex-wrap mb-3 align-items-center">
                  <span className="text-white-50 me-2 small fw-medium">Modalidade de trabalho:</span>
                  {["todos", "remoto", "hibrido", "presencial"].map((mod) => (
                    <button key={mod} className={`btn btn-filtro rounded-pill px-3 py-1 btn-sm ${modalidadeFiltro === mod ? 'active' : ''}`} onClick={() => setModalidadeFiltro(mod)}>
                      {mod === "todos" ? "Todas" : mod.charAt(0).toUpperCase() + mod.slice(1)}
                    </button>
                  ))}
                </div>

                {/* CABEÇALHO DA LISTAGEM */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <h4 className="fw-bold text-white mb-0">Vagas Disponíveis</h4>
                    <button className={`btn btn-terceiro rounded-pill px-3 py-1 btn-sm fw-bold ${mostrarFavoritos ? 'bg-warning text-dark' : ''}`} onClick={() => setMostrarFavoritos(!mostrarFavoritos)}>
                      <i className="bi bi-bookmark-fill me-1" /> {mostrarFavoritos ? "Ver Todas" : "Ver Favoritos"}
                    </button>
                  </div>
                  <span className="badge bg-white text-dark rounded-pill px-3 py-2">
                    Mostrando {vagasFiltradas.length} vaga(s)
                  </span>
                </div>

                {/* SEÇÃO CARD RENDER REAIS */}
                <div className="row g-4 mb-5" id="jobs-container">
                  {loading && <p className="text-center py-3 text-white-50">Buscando vagas...</p>}
                  {erro && <div className="alert alert-danger text-center w-100">{erro}</div>}
                  {!loading && vagasFiltradas.length === 0 && <p className="text-center text-white-50">Nenhuma vaga encontrada.</p>}

                  {!loading && vagasFiltradas.map((vaga) => {
                    const tags = Array.isArray(vaga.tags_vaga) ? vaga.tags_vaga : [];

                    return (
                      <div key={vaga.id} className="col-md-6 col-xl-4 job-item">
                        <div className="card h-100 border-0 rounded-4 shadow-sm" style={{ backgroundColor: "var(--cor-cards-vagas)" }}>
                          <div className="card-body d-flex flex-column p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="d-flex align-items-center gap-3">
                                <div className="rounded-3 d-flex align-items-center justify-content-center shadow-sm cor-fundo" style={{ width: 55, height: 55 }}>
                                  <i className="bi bi-code-slash fs-3 text-base-escuro" />
                                </div>
                                <div>
                                  <h5 className="fw-bold mb-0 text-base-escuro card-job-title">{vaga.titulo}</h5>
                                  <small className="text-mutado fw-bold card-job-company">{vaga.empresa_nome || "Empresa Parceira"}</small>
                                </div>
                              </div>
                              <button className="btn btn-terceiro btn-salvar-vaga rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }} onClick={() => alternarFavorito(vaga.id)}>
                                <i className={`bi ${favoritos.includes(vaga.id) ? 'bi-bookmark-fill text-warning' : 'bi-bookmark'} fs-5`} />
                              </button>
                            </div>

                            <div className="d-flex gap-2 flex-wrap mb-2 mt-1">
                              <span className="badge border rounded-pill px-3 py-2 text-base-escuro fw-bold text-capitalize" style={{ borderColor: "rgba(0,0,0,0.1)", backgroundColor: "transparent" }}>
                                {vaga.tipo}
                              </span>
                              <span className="badge border rounded-pill px-3 py-2 text-base-escuro fw-bold" style={{ borderColor: "rgba(0,0,0,0.1)", backgroundColor: "transparent" }}>
                                <i className="bi bi-geo-alt me-1" />{vaga.local || "Não especificado"}
                              </span>
                            </div>

                            <div className="d-flex flex-wrap gap-1 mb-3">
                              {tags.length > 0 ? (
                                tags.map((tech, idx) => (
                                  <span key={idx} className="badge bg-dark bg-opacity-10 text-dark rounded-1 fw-semibold" style={{ fontSize: '0.75rem' }}>
                                    {tech}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted opacity-50" style={{ fontSize: '0.75rem' }}>Sem tags definidas</span>
                              )}
                            </div>

                            <p className="small mb-4 flex-grow-1 card-job-desc text-dark" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {vaga.descricao}
                            </p>

                            <div className="d-flex justify-content-between align-items-center pt-3 mt-auto" style={{ borderTop: "1px solid rgba(94, 128, 127, 0.2)" }}>
                              <div>
                                <span className="d-block text-mutado fw-bold" style={{ fontSize: "0.75rem" }}>Faixa Salarial</span>
                                <span className="fw-bold text-base-escuro card-job-salary">
                                  {vaga.salario ? `R$ ${vaga.salario}` : "A combinar"}
                                </span>
                              </div>
                              <button className="btn btn-primeiro rounded-3 px-4 py-2 open-modal-btn fw-semibold small" onClick={() => { setVagaSelecionada(vaga); setCandidaturaStatus({ loading: false, msg: "", erro: false, matchScore: null }); }}>
                                Ver Detalhes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DETALHES */}
      {vagaSelecionada && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 text-dark">
              <div className="modal-header">
                <h4 className="modal-title fw-bold text-success">{vagaSelecionada.titulo}</h4>
                <button type="button" className="btn-close" onClick={() => setVagaSelecionada(null)} />
              </div>
              <div className="modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>

                {candidaturaStatus.matchScore !== null && (
                  <div className="p-3 mb-4 rounded-3 text-center shadow-sm text-white" style={{ backgroundImage: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}>
                    <h5 className="fw-bold mb-1"><i className="bi bi-heart-pulse-fill me-2" />Seu Match Real com esta Vaga:</h5>
                    <div className="display-4 fw-bold m-2">{candidaturaStatus.matchScore}%</div>
                    <p className="small mb-0 opacity-75">Aderência calculada com base nas competências requeridas.</p>
                  </div>
                )}

                <div className="mb-3 d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <p className="fw-semibold mb-1 fs-5 text-muted">{vagaSelecionada.empresa_nome}</p>
                    <p className="fw-bold text-success mb-0 fs-5">{vagaSelecionada.salario ? `R$ ${vagaSelecionada.salario}` : "Salário A combinar"}</p>
                  </div>

                  <div className="d-flex flex-wrap gap-1">
                    {(Array.isArray(vagaSelecionada.tags_vaga) ? vagaSelecionada.tags_vaga : []).map((tech, idx) => (
                      <span key={idx} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-2 fw-bold px-2 py-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <hr />
                <div className="mb-4">
                  <h5 className="fw-bold text-dark">Descrição da Vaga</h5>
                  <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{vagaSelecionada.descricao}</p>
                </div>
                <div className="mb-4">
                  <h5 className="fw-bold text-dark">Requisitos</h5>
                  <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{vagaSelecionada.requisitos || "Não informados."}</p>
                </div>

                {candidaturaStatus.msg && (
                  <div className={`alert ${candidaturaStatus.erro ? 'alert-danger' : 'alert-success'} mt-3`} role="alert">
                    {candidaturaStatus.msg}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setVagaSelecionada(null)}>Fechar</button>
                <button type="button" className="btn btn-success fw-bold" disabled={candidaturaStatus.loading || candidaturaStatus.matchScore !== null} onClick={() => handleCandidatar(vagaSelecionada.id)}>
                  {candidaturaStatus.loading ? 'Processando Match...' : candidaturaStatus.matchScore !== null ? '✓ Candidatura Concluída' : 'Candidatar-se'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}