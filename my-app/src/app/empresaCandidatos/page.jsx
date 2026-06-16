"use client";

import { useEffect, useState } from "react";

export default function CandidatosEmpresa() {
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarCandidatos();
    }, []);

    async function carregarCandidatos() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "http://localhost:3001/api/funcionarios",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const json = await res.json();

            if (res.ok) {
                setCandidatos(json);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const demitirFuncionario = async (id) => {
    if (!window.confirm("Deseja realmente desligar este funcionário?")) {
        return;
    }

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `http://localhost:3001/api/funcionarios/${id}/desligar`,
            {
                method: "PUT", // ou DELETE dependendo da rota
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    motivo_saida: "Desligado pelo sistema"
                })
            }
        );

        const data = await res.json();

        if (res.ok) {
            alert("Funcionário desligado com sucesso!");
            carregarFuncionarios();
        } else {
            alert(data.erro);
        }

    } catch (err) {
        console.log(err);
    }
};

    return (
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
                                <i className="bi bi-people me-2 text-success" />
                                Gestão de Talentos
                            </h2>
                            <p className="text-muted mb-0">
                                Visualize todos os profissionais vinculados à sua empresa, monitore status e gerencie processos corporativos.
                            </p>
                        </div>
                        <div className="mt-3 mt-md-0">
                            <span className="badge bg-dark rounded-pill px-4 py-2 shadow-sm text-white fw-bold">
                                {candidatos.length} Profissional(is)
                            </span>
                        </div>
                    </div>

                    {/* LOADING STATE */}
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status" />
                            <p className="text-muted mt-2 fw-medium">Carregando dados operacionais dos profissionais...</p>
                        </div>
                    )}

                    {/* PAINEL SEM REGISTROS */}
                    {!loading && candidatos.length === 0 && (
                        <div className="text-center py-5 border border-dashed rounded-4 bg-white bg-opacity-50">
                            <i className="bi bi-people display-3 text-muted"></i>
                            <h5 className="fw-bold mt-3 text-dark">Nenhum profissional encontrado</h5>
                            <p className="text-muted px-3">Sua empresa ainda não possui candidatos ou funcionários registrados no sistema.</p>
                        </div>
                    )}

                    {/* GRADE DE PROFISSIONAIS (LISTA CORPORATIVA) */}
                    <div className="row g-4">
                        {!loading && candidatos.map((cand) => (
                            <div key={cand.id} className="col-12">
                                <div className="card border-0 rounded-4 shadow-sm w-100" style={{ backgroundColor: "#EAF2F0" }}>
                                    <div className="card-body p-4 d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-4">

                                        {/* Bloco de Informações */}
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 text-capitalize fw-bold border border-success border-opacity-25">
                                                    {cand.status}
                                                </span>
                                                <span className="text-muted small fw-medium">
                                                    <i className="bi bi-calendar3 me-1" /> Admissão: {cand.data_admissao ? new Date(cand.data_admissao).toLocaleDateString('pt-BR') : "-"}
                                                </span>
                                            </div>

                                            <h4 className="fw-bold mb-2 text-dark font-georgia">{cand.nome}</h4>

                                            <div className="d-flex flex-wrap gap-3 text-secondary small">
                                                <span><i className="bi bi-envelope me-1 text-success" />{cand.email || "E-mail não informado"}</span>
                                            </div>
                                        </div>

                                        {/* Bloco de Ações Corporativas */}
                                        <div className="d-flex flex-wrap gap-2 align-self-start align-self-xl-center" style={{ minWidth: 'fit-content' }}>
                                            <button
                                                className="btn btn-danger d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm fw-bold"
                                                onClick={() => demitirFuncionario(cand.id)}
                                            >
                                                <i className="bi bi-person-dash-fill" /> Desligar
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    </div>
</main>




    );
}