"use client";

import { useState, useEffect } from 'react';

export default function GerenciamentoVagasEmpresa() {
    // ── ESTADOS DE DADOS ─────────────────────────────────────────
    const [vagas, setVagas] = useState([]);
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // ── MODAIS E SELEÇÕES ────────────────────────────────────────
    const [vagaParaCandidatos, setVagaParaCandidatos] = useState(null);
    const [loadingCandidatos, setLoadingCandidatos] = useState(false);
    const [vagaParaEditar, setVagaParaEditar] = useState(null);

    const [admissaoForm, setAdmissaoForm] = useState({
        cargo_id: "",
        setor_id: "",
        data_admissao: new Date().toISOString().split("T")[0]
    });

    // ── REQUISITAR AS VAGAS DA EMPRESA ───────────────────────────
    const carregarVagasEmpresa = async () => {
        try {
            setLoading(true);
            setErro(null);
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error("Sua sessão expirou. Por favor, realize o login novamente.");
            }

            // O backend filtra usando o token do usuário corporativo logado
            const response = await fetch('http://localhost:3001/api/vagas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Não foi possível obter os dados das vagas corporativas.');
            }

            const dados = await response.json();
            setVagas(dados);
        } catch (err) {
            console.error(err);
            setErro(err.message || "Erro de comunicação com o servidor principal.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarVagasEmpresa();
    }, []);

    const rejeitarCandidato = async (candidatoId) => {
        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3001/api/vagas/rejeitar-candidato",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        vaga_id: vagaParaCandidatos.id,
                        candidato_id: candidatoId
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao rejeitar candidato");
            }

            abrirCandidatos(vagaParaCandidatos);

        } catch (err) {
            alert(err.message);
        }
    };

    // ── RANKING INTEGRADO POR INTELIGÊNCIA DE MATCH ──────────────
    const abrirCandidatos = async (vaga) => {
        setVagaParaCandidatos(vaga);
        setLoadingCandidatos(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/vagas/${vaga.id}/ranking`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const erro = await response.text();
                console.error("Erro da API:", erro);
                throw new Error(erro);
            }

            const dados = await response.json();
            setCandidatos(dados);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoadingCandidatos(false);
        }
    };

    // ── REALIZAR ADMISSÃO CONFORME ESPECIFICAÇÃO DE ROUTE ────────
    const handleAdmitirFuncionario = async (candidatoId) => {
        try {
            const token = localStorage.getItem('token');

            const payload = {
                candidato_id: Number(candidatoId),
                cargo_id: Number(admissaoForm.cargo_id),
                setor_id: Number(admissaoForm.setor_id),
                data_admissao: admissaoForm.data_admissao
            };

            console.log("PAYLOAD:", payload);

            const response = await fetch(
                'http://localhost:3001/api/funcionarios/admitir',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const resErr = await response.json();
                throw new Error(
                    resErr.erro || 'Falha ao processar a contratação.'
                );
            }

            alert('Funcionário admitido com sucesso!');

            setVagaParaCandidatos(null);

            if (vagaParaCandidatos) {
                await fetch(
                    `http://localhost:3001/api/vagas/${vagaParaCandidatos.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            status: 'fechada'
                        })
                    }
                );
            }

            carregarVagasEmpresa();
        } catch (err) {
            alert(err.message);
        }
    };

    // ── SALVAR EDIÇÃO DA VAGA (PUT) ──────────────────────────────
    const handleSalvarEdicao = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dadosVaga = Object.fromEntries(formData.entries());

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/vagas/${vagaParaEditar.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosVaga)
            });

            if (!response.ok) throw new Error('Não foi possível salvar as modificações da oportunidade.');

            alert('Alterações salvas e propagadas no sistema com sucesso!');
            setVagaParaEditar(null);
            carregarVagasEmpresa();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>MatchHire - Painel Corporativo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

            {/* RENDERIZAÇÃO PRINCIPAL COM O DESIGN INSTITUCIONAL DO MATCHHIRE */}
            <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4 mb-0 pb-0">
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
                                {/* TOPO DO PAINEL */}
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 border-bottom border-dark border-opacity-10 pb-4">
                                    <div>
                                        <h2 className="fw-bold font-georgia mb-2 text-dark">
                                            <i className="bi bi-building-gear me-2 text-success" />
                                            Painel Executivo de Vagas
                                        </h2>
                                        <p className="text-muted mb-0">
                                            Monitore seus anúncios de emprego, gerencie processos e contrate talentos em tempo real.
                                        </p>
                                    </div>
                                    <div className="mt-3 mt-md-0">
                                        <span className="badge bg-dark rounded-pill px-4 py-2 shadow-sm text-white fw-bold">
                                            {vagas.length} Oportunidade(s) Ativa(s)
                                        </span>
                                    </div>
                                </div>

                                {loading && (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-success" role="status" />
                                        <p className="text-muted mt-2 fw-medium">Carregando painel operacional da empresa...</p>
                                    </div>
                                )}

                                {erro && <div className="alert alert-danger shadow-sm text-center border-0">{erro}</div>}

                                {/* PAINEL SEM VAGAS */}
                                {!loading && vagas.length === 0 && (
                                    <div className="text-center py-5 border border-dashed rounded-4 bg-white bg-opacity-50">
                                        <i className="bi bi-file-earmark-plus display-3 text-muted"></i>
                                        <h5 className="fw-bold mt-3 text-dark">Nenhuma vaga ativa</h5>
                                        <p className="text-muted px-3">Sua empresa ainda não possui vagas abertas no sistema neste momento.</p>
                                    </div>
                                )}

                                {/* GRADE DE VAGAS DA EMPRESA */}
                                <div className="row g-4">
                                    {!loading && vagas.map((vaga) => {
                                        console.log(vaga);
                                        const tags = Array.isArray(vaga.tags_vaga) ? vaga.tags_vaga : [];

                                        return (
                                            <div key={vaga.id} className="col-12">
                                                <div className="card border-0 rounded-4 shadow-sm w-100" style={{ backgroundColor: "#EAF2F0" }}>
                                                    <div className="card-body p-4 d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-4">

                                                        {/* Bloco de Informações */}
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 text-capitalize fw-bold border border-success border-opacity-25">
                                                                    {vaga.tipo}
                                                                </span>
                                                                <span className="text-muted small fw-medium">
                                                                    <i className="bi bi-calendar3 me-1" /> Publicada em {new Date(vaga.criado_em).toLocaleDateString('pt-BR')}
                                                                </span>
                                                            </div>

                                                            <h4 className="fw-bold mb-2 text-dark font-georgia">{vaga.titulo}</h4>

                                                            <div className="d-flex flex-wrap gap-3 text-secondary small mb-3">
                                                                <span><i className="bi bi-geo-alt me-1 text-success" />{vaga.local || "Não especificado"}</span>
                                                                <span><i className="bi bi-cash-stack me-1 text-success" />{vaga.salario ? `R$ ${vaga.salario}` : "A combinar"}</span>
                                                                <span><i className="bi bi-briefcase me-1 text-success" />{vaga.cargo_nome || "Geral"}</span>
                                                            </div>

                                                            {/* Chips de Tags */}
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {tags.length > 0 ? (
                                                                    tags.map((t, idx) => (
                                                                        <span key={idx} className="badge bg-dark bg-opacity-10 text-dark rounded-1 fw-semibold px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                                            {t}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-muted opacity-50 small">Sem tags configuradas</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Bloco de Ações Corporativas */}
                                                        <div className="d-flex flex-wrap gap-2 align-self-start align-self-xl-center" style={{ minWidth: 'fit-content' }}>
                                                            <button
                                                                className="btn btn-dark d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm fw-bold"
                                                                onClick={() => abrirCandidatos(vaga)}
                                                            >
                                                                <i className="bi bi-lightning-charge-fill text-warning" /> Match & Candidatos
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-dark bg-white bg-opacity-50 px-3 py-2 rounded-3 fw-medium"
                                                                onClick={() => setVagaParaEditar(vaga)}
                                                            >
                                                                <i className="bi bi-pencil" /> Editar
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

            {/* ── MODAL: RANKING DE INTELIGÊNCIA E ADMISSÃO DE QUADRO ── */}
            {vagaParaCandidatos && (
                <div className="modal show d-block animate-fade-in" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1100 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 text-dark shadow-lg">
                            <div className="modal-header border-bottom border-light p-4 bg-light">
                                <div>
                                    <span className="text-success small fw-bold text-uppercase tracking-wider">Módulo de Seleção Integrada</span>
                                    <h4 className="modal-title fw-bold text-dark mt-1">Postulantes: {vagaParaCandidatos.titulo}</h4>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setVagaParaCandidatos(null)} />
                            </div>

                            <div className="modal-body p-4 bg-white" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                                {loadingCandidatos && (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-success" role="status" />
                                        <p className="text-muted mt-2">Processando correlações de inteligência artificial de currículos...</p>
                                    </div>
                                )}

                                {!loadingCandidatos && candidatos.length === 0 && (
                                    <div className="text-center py-4 text-muted">
                                        <i className="bi bi-people display-4 text-opacity-25" />
                                        <p className="mt-2">Nenhum profissional realizou a inscrição para esta oportunidade até o momento.</p>
                                    </div>
                                )}

                                {/* FORMULÁRIO RÁPIDO PARA ALOCAR CARGO E SETOR NO CONTRATO */}

                                {/* CARDS DOS CANDIDATOS FILTRADOS POR MATCH */}
                                {!loadingCandidatos && candidatos.map((cand, idx) => {

                                    console.log(cand);

                                    const pct = Number(cand.score_match);

                                    // Definição de cores conforme o nível do match
                                    let badgeCor = "bg-danger";

                                    if (pct >= 75) {
                                        badgeCor = "bg-success";
                                    }
                                    else if (pct >= 50) {
                                        badgeCor = "bg-warning text-dark";
                                    }

                                    return (
                                        <div key={cand.id || idx} className="p-3 mb-3 rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white border border-light shadow-sm gap-3">
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <h5 className="fw-bold mb-0 text-dark">{cand.candidato_nome || "Profissional Cadastrado"}</h5>
                                                    <span
                                                        className={`badge ${badgeCor} rounded-pill px-2 py-1 small fw-bold`}
                                                        style={{ fontSize: '0.72rem' }}
                                                    >
                                                        {pct}% Match
                                                    </span>
                                                </div>
                                                <p className="text-muted small mb-0">
                                                    <i className="bi bi-envelope me-1" /> {cand.candidato_email || "E-mail confidencial"}
                                                </p>
                                            </div>

                                            <div>
                                                <button
                                                    className="btn btn-success fw-bold px-4 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                                    onClick={() => handleAdmitirFuncionario(cand.candidato_id || cand.id)}
                                                >
                                                    <i className="bi bi-person-check-fill" /> Formalizar Admissão
                                                </button>
                                            </div>

                                            <div>
                                                <button
                                                    className="btn btn-danger rounded-pill fw-bold"
                                                    onClick={() => rejeitarCandidato(cand.candidato_id)}
                                                >
                                                    <i className="bi bi-x-circle-fill"></i>
                                                    Rejeitar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="modal-footer border-top p-3 bg-light">
                                <button type="button" className="btn btn-secondary px-4 rounded-3" onClick={() => setVagaParaCandidatos(null)}>Fechar Janela</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: ALTERAR DETALHES DA VAGA (FORM COMPLETO) ── */}
            {vagaParaEditar && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1100 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 text-dark shadow-lg">
                            <form onSubmit={handleSalvarEdicao}>
                                <div className="modal-header border-bottom p-4 bg-light">
                                    <h4 className="modal-title fw-bold text-dark"><i className="bi bi-pencil-square text-success me-2" />Modificar Propriedades do Anúncio</h4>
                                    <button type="button" className="btn-close" onClick={() => setVagaParaEditar(null)} />
                                </div>

                                <div className="modal-body p-4 bg-white" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-secondary">Título da Oportunidade *</label>
                                        <input type="text" name="titulo" className="form-control" defaultValue={vagaParaEditar.titulo} required maxLength={150} />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small text-secondary">Modalidade *</label>
                                            <select name="tipo" className="form-select" defaultValue={vagaParaEditar.tipo} required>
                                                <option value="presencial">Presencial</option>
                                                <option value="hibrido">Híbrido</option>
                                                <option value="remoto">Remoto</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small text-secondary">Localização Física</label>
                                            <input type="text" name="local" className="form-control" defaultValue={vagaParaEditar.local} placeholder="Ex: São Paulo, SP" maxLength={200} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-secondary">Remuneração Ofertada (R$)</label>
                                        <input type="text" name="salario" className="form-control" defaultValue={vagaParaEditar.salario} placeholder="Ex: 6.500,00" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-secondary">Descrição das Atividades</label>
                                        <textarea name="descricao" className="form-control" rows={4} defaultValue={vagaParaEditar.descricao} placeholder="Descreva responsabilidades..." />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-secondary">Requisitos e Competências</label>
                                        <textarea name="requisitos" className="form-control" rows={3} defaultValue={vagaParaEditar.requisitos} placeholder="Ex: Hard skills e Soft skills..." />
                                    </div>
                                </div>

                                <div className="modal-footer border-top p-3 bg-light">
                                    <button type="button" className="btn btn-secondary px-4 rounded-3" onClick={() => setVagaParaEditar(null)}>Cancelar</button>
                                    <button type="submit" className="btn btn-success fw-bold px-4 rounded-3 shadow-sm">Salvar Atualizações</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}