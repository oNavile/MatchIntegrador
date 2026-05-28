"use client"; // 🔥 Obrigatorio para usar interações e hooks no Next.js App Router

import { useEffect, useState } from "react";

export default function Vagas() {
  // ── ESTADOS DO REACT (Substituem os let/const globais do script) ───────────
  const [pesquisa, setPesquisa] = useState("");
  const [localidade, setLocalidade] = useState("todos");
  const [modalidade, setModalidade] = useState("todos");
  const [senioridade, setSenioridade] = useState("todos");

  // Estado para armazenar qual vaga está aberta no Modal
  const [vagaSelecionada, setVagaSelecionada] = useState({
    title: "",
    company: "",
    desc: "",
    salary: "",
  });

  // Lista estática de vagas espelhando os seus cards de HTML
  const todasAsVagas = [
    {
      id: 1,
      title: "Engenheiro de Software Front-end React",
      titleExibicao: "Engenheiro de Software",
      company: "TechNova Solutions",
      location: "remoto",
      tags: "remoto senior",
      badgeLocation: "100% Remoto",
      badgeSenior: "Sênior",
      desc: "Buscamos desenvolvedor especialista em React, Node.js e ecossistema AWS para liderar o desenvolvimento de nossa nova plataforma SaaS global.",
      salary: "R$ 12.000 - R$ 15.000",
      bgColor: "#0052CC",
      icon: "bi-code-slash",
    },
    {
      id: 2,
      title: "Product Designer UX UI Figma",
      titleExibicao: "Product Designer (UX/UI)",
      company: "Creative Studio",
      location: "sp",
      tags: "hibrido pleno",
      badgeLocation: "Híbrido (SP)",
      badgeSenior: "Pleno",
      desc: "Venha desenhar interfaces incríveis e mapear a jornada de usuários utilizando metodologias de Design Thinking e ferramentas do Figma.",
      salary: "R$ 7.000 - R$ 9.000",
      bgColor: "#FF4F00",
      icon: "bi-palette-fill",
    },
    {
      id: 3,
      title: "Desenvolvedor Full Stack Júnior",
      titleExibicao: "Dev Full Stack Júnior",
      company: "Growth Corp",
      location: "rj",
      tags: "presencial junior",
      badgeLocation: "Presencial (RJ)",
      badgeSenior: "Júnior",
      desc: "Oportunidade ideal para início de carreira técnica. Atuação direta com manutenção de sistemas em JavaScript e SQL.",
      salary: "R$ 3.500 - R$ 4.500",
      bgColor: "#00A650",
      icon: "bi-braces",
    },
  ];

  // Estado para controlar quais vagas estão favoritadas (IDs)
  const [favoritos, setFavoritos] = useState([]);

  // Alternar o botão de favoritos (Bookmark)
  const alternarFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((favId) => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  // ── 1. FILTRAGEM COMBINADA EM TEMPO REAL ────────────────────────────────────
  const vagasFiltradas = todasAsVagas.filter((vaga) => {
    const matchText =
      vaga.title.toLowerCase().includes(pesquisa.toLowerCase().trim()) ||
      vaga.company.toLowerCase().includes(pesquisa.toLowerCase().trim());

    const matchLocation = localidade === "todos" || vaga.location === localidade;
    const matchModality = modalidade === "todos" || vaga.tags.includes(modalidade);
    
    // ⬇️ CORRIGIDO AQUI: de 'seniority' para 'senioridade'
    const matchSeniority = senioridade === "todos" || vaga.tags.includes(senioridade);

    return matchText && matchLocation && matchModality && matchSeniority;
  });

  // ── 4. INICIALIZAÇÃO DO BOOTSTRAP ─────────────────────────────────────────
  useEffect(() => {
    // Carrega o JS do Bootstrap no cliente de forma assíncrona
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const abrirModal = (vaga) => {
    setVagaSelecionada({
      title: vaga.titleExibicao,
      company: vaga.company,
      desc: vaga.desc,
      salary: vaga.salary,
    });
  };

  const handleCandidatarSe = () => {
    alert("💥 Faça login para se candidatar a esta vaga e continuar o processo.");
    // Fecha o modal limpando as classes do bootstrap nativamente
    const modalCloseBtn = document.querySelector("#jobDetailModal .btn-close");
    if (modalCloseBtn) modalCloseBtn.click();
  };

  return (
    <>
      <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4">
        <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
          <div
            className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1"
            style={{
              backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
              borderRadius: 0,
              borderTopLeftRadius: 30,
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

                {/* Barra de Pesquisa Integrada com os Estados */}
                <div className="barra-de-pesquisa-vagas d-flex flex-column flex-md-row align-items-md-center mb-4">
                  <div className="d-flex align-items-center flex-fill px-3 py-2 py-md-0">
                    <i className="bi bi-search text-muted fs-5" />
                    <input
                      type="text"
                      className="form-control text-dark"
                      placeholder="Cargo, tecnologia ou empresa..."
                      value={pesquisa}
                      onChange={(e) => setPesquisa(e.target.value)}
                    />
                  </div>
                  <div className="search-divider d-none d-md-block" />
                  <div className="d-flex align-items-center flex-fill px-3 py-2 py-md-0 border-md-0 mt-2 mt-md-0">
                    <i className="bi bi-geo-alt text-muted fs-5" />
                    <select
                      id="location-select"
                      className="form-select text-dark border-0 shadow-none"
                      value={localidade}
                      onChange={(e) => setLocalidade(e.target.value)}
                    >
                      <option value="todos">Qualquer localidade</option>
                      <option value="sp">São Paulo, SP</option>
                      <option value="rj">Rio de Janeiro, RJ</option>
                      <option value="remoto">100% Remoto</option>
                    </select>
                  </div>
                  <div className="px-2 pb-2 pb-md-0 pt-2 pt-md-0 mt-2 mt-md-0 w-100" style={{ maxWidth: 150 }}>
                    <button
                      className="btn w-100 rounded-pill text-white fw-bold py-2"
                      style={{ backgroundColor: "var(--cor-main)" }}
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                {/* Filtro Dinâmico: Modalidade */}
                <div className="d-flex gap-2 flex-wrap mb-3 align-items-center">
                  <span className="text-white-50 me-2 small fw-medium">Modalidade de trabalho:</span>
                  {["todos", "remoto", "hibrido", "presencial"].map((mod) => (
                    <button
                      key={mod}
                      className={`btn btn-filtro rounded-pill px-3 py-1 btn-sm ${modalidade === mod ? "active" : ""}`}
                      onClick={() => setModalidade(mod)}
                    >
                      {mod === "todos" ? "Todas" : mod.charAt(0).toUpperCase() + mod.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Filtro Dinâmico: Senioridade */}
                <div className="d-flex gap-2 flex-wrap mb-5 align-items-center">
                  <span className="text-white-50 me-2 small fw-medium">Nível de senioridade:</span>
                  {["todos", "junior", "pleno", "senior"].map((sen) => (
                    <button
                      key={sen}
                      className={`btn btn-filtro rounded-pill px-3 py-1 btn-sm ${senioridade === sen ? "active" : ""}`}
                      onClick={() => setSenioridade(sen)}
                    >
                      {sen === "todos" ? "Todas" : sen === "senior" ? "Sênior" : sen.charAt(0).toUpperCase() + sen.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold text-white mb-0">Vagas Disponíveis</h4>
                  <span id="job-counter" className="badge bg-white text-dark rounded-pill px-3 py-2">
                    Mostrando {vagasFiltradas.length} {vagasFiltradas.length === 1 ? "vaga" : "vagas"}
                  </span>
                </div>

                {/* Renderização Dinâmica dos Cards Filtrados */}
                <div className="row g-4 mb-5" id="jobs-container">
                  {vagasFiltradas.map((vaga) => (
                    <div key={vaga.id} className="col-md-6 col-xl-4 job-item">
                      <div className="card card-vaga p-2">
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-3 d-flex align-items-center justify-content-center text-white shadow-sm"
                                style={{ width: 55, height: 55, backgroundColor: vaga.bgColor }}
                              >
                                <i className={`bi ${vaga.icon} fs-3`} />
                              </div>
                              <div>
                                <h5 className="fw-bold mb-0 text-dark card-job-title">{vaga.titleExibicao}</h5>
                                <small className="text-muted fw-medium card-job-company">{vaga.company}</small>
                              </div>
                            </div>
                            {/* Sistema de Favoritos Funcional */}
                            <button
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => alternarFavorito(vaga.id)}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={`bi fs-5 ${
                                  favoritos.includes(vaga.id)
                                    ? "bi-bookmark-fill text-warning"
                                    : "bi-bookmark text-muted"
                                  }`}
                              />
                            </button>
                          </div>
                          <div className="d-flex gap-2 flex-wrap mb-3 mt-2">
                            <span className="badge badge-vaga rounded-pill px-3 py-2">{vaga.badgeSenior}</span>
                            <span className="badge badge-vaga rounded-pill px-3 py-2">{vaga.badgeLocation}</span>
                          </div>
                          <p className="text-muted small mb-4 flex-grow-1 card-job-desc">{vaga.desc}</p>
                          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                            <div>
                              <span className="d-block text-muted" style={{ fontSize: "0.75rem" }}>
                                Faixa Salarial
                              </span>
                              <span className="fw-bold text-dark card-job-salary">{vaga.salary}</span>
                            </div>
                            <button
                              className="btn btn-apply"
                              data-bs-toggle="modal"
                              data-bs-target="#jobDetailModal"
                              onClick={() => abrirModal(vaga)}
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {vagasFiltradas.length === 0 && (
                    <div className="col-12 text-center py-5">
                      <p className="text-white-50 fs-5">Nenhuma vaga corresponde aos filtros selecionados.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Dinâmico Integrado com Dados Seguros do React */}
      <div className="modal fade" id="jobDetailModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-dark">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="modal-title">
                {vagaSelecionada.title || "Detalhes da Vaga"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p id="modal-company" className="fw-semibold text-muted">
                <i className="bi bi-building me-2" /> {vagaSelecionada.company}
              </p>
              <p id="modal-salary" className="fw-bold text-success">
                <i className="bi bi-cash-stack me-2" /> {vagaSelecionada.salary}
              </p>
              <hr />
              <p id="modal-desc">{vagaSelecionada.desc}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Fechar
              </button>
              <button type="button" id="submit-apply-btn" className="btn btn-apply" onClick={handleCandidatarSe}>
                Candidatar-se
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}