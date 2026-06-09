"use client";

import { useState, useEffect } from 'react';

export default function VagasSemCadastro() {
  // ── ESTADOS PARA PUXAR AS INFORMAÇÕES DA API ────────────────
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // ── ESTADOS DE FILTRAGEM E BUSCA ────────────────────────────
  const [busca, setBusca] = useState("");
  const [localidadeSelect, setLocalidadeSelect] = useState("todos");
  const [modalidadeFiltro, setModalidadeFiltro] = useState("todos");
  const [senioridadeFiltro, setSenioridadeFiltro] = useState("todos");

  // ── ESTADO DO MODAL DE DETALHES ─────────────────────────────
  const [vagaSelecionada, setVagaSelecionada] = useState(null);

  // ── PUXANDO AS INFORMAÇÕES IGUAL O COMPONENTE "VAGAS" ───────
  useEffect(() => {
    async function carregarVagas() {
      try {
        setLoading(true);
        setErro(null);

        // Fetch direto para a API, sem precisar de Token pois é a página Sem Cadastro
        const response = await fetch('http://localhost:3001/api/vagas', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store' 
        });

       if (!response.ok) {
  const texto = await response.text();

  console.log("Status:", response.status);
  console.log("Resposta:", texto);

  throw new Error(
    `Erro ${response.status}: ${texto}`
  );
}
        const dados = await response.json();
        setVagas(dados);
      } catch (err) {
        console.error(err);
        setErro(err.message || "Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    }
    carregarVagas();
  }, []);

  // ── LÓGICA DE FILTRAGEM (Igual ao componente Vagas) ─────────
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

    return matchesBusca && matchesLocal && matchesModalidade && matchesSenioridade;
  });

  return (
    <>
      <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4">
        <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
          <div
            className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1"
            style={{
              backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
              borderRadius: 0,
              borderTopLeftRadius: 30
            }}
          >
            <div className="row w-100 mx-0">
              <div className="col-12 px-0">
                <div className="mb-4">
                  <h1 className="font-georgia fw-bold text-white mb-2">
                    Encontre seu Match Profissional
                  </h1>
                  <p className="text-white-50 fs-5">
                    Milhares de vagas integradas e atualizadas em tempo real.
                  </p>
                </div>
                
                {/* BARRA DE PESQUISA */}
                <div className="barra-de-pesquisa-vagas d-flex flex-column flex-md-row align-items-md-center mb-4">
                  <div className="d-flex align-items-center flex-fill px-3 py-2 py-md-0">
                    <i className="bi bi-search text-muted fs-5" />
                    <input 
                      type="text" 
                      className="form-control text-dark border-0 shadow-none bg-transparent" 
                      placeholder="Cargo, tecnologia ou empresa..." 
                      value={busca} 
                      onChange={(e) => setBusca(e.target.value)} 
                    />
                  </div>
                  <div className="search-divider d-none d-md-block" />
                  <div className="d-flex align-items-center flex-fill px-3 py-2 py-md-0 border-md-0 mt-2 mt-md-0">
                    <i className="bi bi-geo-alt text-muted fs-5" />
                    <select 
                      className="form-select text-dark border-0 shadow-none bg-transparent" 
                      value={localidadeSelect} 
                      onChange={(e) => setLocalidadeSelect(e.target.value)}
                    >
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

                {/* FILTROS */}
                <div className="d-flex gap-2 flex-wrap mb-3 align-items-center">
                  <span className="text-white-50 me-2 small fw-medium">Modalidade de trabalho:</span>
                  {["todos", "remoto", "hibrido", "presencial"].map((mod) => (
                    <button key={mod} className={`btn btn-filtro rounded-pill px-3 py-1 btn-sm ${modalidadeFiltro === mod ? 'active' : ''}`} onClick={() => setModalidadeFiltro(mod)}>
                      {mod === "todos" ? "Todas" : mod.charAt(0).toUpperCase() + mod.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="d-flex gap-2 flex-wrap mb-5 align-items-center">
                  <span className="text-white-50 me-2 small fw-medium">Nível de senioridade:</span>
                  {["todos", "junior", "pleno", "senior"].map((sen) => (
                    <button key={sen} className={`btn btn-filtro rounded-pill px-3 py-1 btn-sm ${senioridadeFiltro === sen ? 'active' : ''}`} onClick={() => setSenioridadeFiltro(sen)}>
                      {sen === "todos" ? "Todas" : sen === "junior" ? "Júnior" : sen === "senior" ? "Sênior" : "Pleno"}
                    </button>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold text-white mb-0">Vagas Disponíveis</h4>
                  <span className="badge bg-white text-dark rounded-pill px-3 py-2">Mostrando {vagasFiltradas.length} vaga(s)</span>
                </div>

                {/* RENDERIZAÇÃO DOS CARDS COM OS DADOS DA API */}
                <div className="row g-4 mb-5" id="jobs-container">
                  {loading && <p className="text-center py-3 text-white-50">Buscando vagas...</p>}
                  {erro && <div className="alert alert-danger text-center w-100">{erro}</div>}
                  {!loading && vagasFiltradas.length === 0 && <p className="text-center text-white-50">Nenhuma vaga encontrada.</p>}

                  {!loading && vagasFiltradas.map((vaga) => {
                    const tags = Array.isArray(vaga.tags_vaga) ? vaga.tags_vaga : [];

                    return (
                      <div key={vaga.id} className="col-md-6 col-xl-4 job-item">
                        <div className="card h-100 border-0 rounded-4 shadow-sm" style={{ backgroundColor: "var(--cor-cards-vagas, #fff)" }}>
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
                              {tags.length > 0 ? tags.map((tech, idx) => (
                                <span key={idx} className="badge bg-dark bg-opacity-10 text-dark rounded-1 fw-semibold" style={{ fontSize: '0.75rem' }}>{tech}</span>
                              )) : <span className="text-muted opacity-50" style={{ fontSize: '0.75rem' }}>Sem tags definidas</span>}
                            </div>

                            <p className="small mb-4 flex-grow-1 card-job-desc text-dark" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {vaga.descricao}
                            </p>

                            <div className="d-flex justify-content-between align-items-center pt-3 mt-auto" style={{ borderTop: "1px solid rgba(94, 128, 127, 0.2)" }}>
                              <div>
                                <span className="d-block text-mutado fw-bold" style={{ fontSize: "0.75rem" }}>Faixa Salarial</span>
                                <span className="fw-bold text-base-escuro card-job-salary">{vaga.salario ? `R$ ${vaga.salario}` : "A combinar"}</span>
                              </div>
                              <button className="btn btn-primeiro rounded-3 px-4 py-2 open-modal-btn fw-semibold small" onClick={() => setVagaSelecionada(vaga)}>
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

      {/* MODAL DETALHES DA VAGA (ADAPTADO DO SEU ORIGINAL) */}
      {vagaSelecionada && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark">
              
              <div className="modal-header">
                <h5 className="modal-title fw-bold" id="modal-title">{vagaSelecionada.titulo}</h5>
                <button type="button" className="btn-close" onClick={() => setVagaSelecionada(null)} />
              </div>

              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <p id="modal-company" className="fw-semibold text-muted">{vagaSelecionada.empresa_nome}</p>
                <p id="modal-salary" className="fw-bold text-success">{vagaSelecionada.salario ? `R$ ${vagaSelecionada.salario}` : "Salário A combinar"}</p>
                <hr />
                <h6 className="fw-bold text-dark">Descrição da Vaga</h6>
                <p id="modal-desc" style={{ whiteSpace: 'pre-line' }}>{vagaSelecionada.descricao}</p>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setVagaSelecionada(null)}>
                  Fechar
                </button>
                {/* COMO É SEM CADASTRO, O BOTÃO DEVE REDIRECIONAR PARA O LOGIN */}
                <a href="/login" id="submit-apply-btn" className="btn btn-primeiro">
                  Faça login para se candidatar
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}