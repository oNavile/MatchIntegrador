"use client";

import { useEffect, useState } from "react";

export default function AdminVagas() {
    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarVagas();
    }, []);

    async function carregarVagas() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "http://localhost:3001/api/admin/vagas",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();
            setVagas(data);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function excluirVaga(id) {
        const confirmar = confirm(
            "Deseja realmente excluir esta vaga?"
        );

        if (!confirmar) return;

        try {
            const token = localStorage.getItem("token");

            await fetch(
                `http://localhost:3001/api/admin/vagas/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            carregarVagas();

        } catch (err) {
            console.log(err);
        }
    }

    if (loading) {
        return (
            <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
                <div className="spinner-border text-success" />
            </main>
        );
    }

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
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 border-bottom border-dark border-opacity-10 pb-4">
                                <div>
                                    <h2 className="fw-bold font-georgia mb-2 text-dark">
                                        <i className="bi bi-briefcase-fill me-2 text-success" />
                                        Controle Geral de Vagas
                                    </h2>
                                    <p className="text-muted small mb-0">
                                        Monitore, analise os detalhes financeiros e remova posições ativas ou encerradas no ecossistema MatchHire.
                                    </p>
                                </div>
                                <div className="mt-3 mt-md-0">
                                    <span className="badge bg-dark rounded-pill px-4 py-2 shadow-sm text-white fw-bold">
                                        {vagas.length} Vaga(s) Cadastrada(s)
                                    </span>
                                </div>
                            </div>
                            <div className="row g-4">
                                {vagas.map((vaga) => (
                                    <div key={vaga.id} className="col-12">
                                        <div className="card border-0 rounded-4 shadow-sm w-100" style={{ backgroundColor: "#EAF2F0" }}>
                                            <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                                                <div className="flex-grow-1">
                                                    <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 text-uppercase fw-bold border border-success border-opacity-25 small">
                                                            {vaga.tipo}
                                                        </span>
                                                        <span className={`badge rounded-pill px-2 py-1 small ${vaga.status === 'Ativa' || vaga.status === 'Aberta' ? 'bg-success' : 'bg-secondary'}`}>
                                                            {vaga.status}
                                                        </span>
                                                        <span className="text-muted small fw-medium ms-auto ms-md-0">
                                                            ID: #{vaga.id}
                                                        </span>
                                                    </div>

                                                    <h4 className="fw-bold mb-1 text-dark font-georgia">
                                                        {vaga.titulo}
                                                    </h4>
                                                    
                                                    <p className="text-secondary mb-3 fw-medium">
                                                        <i className="bi bi-building me-1 text-success" /> {vaga.empresa}
                                                    </p>

                                                    <div className="d-flex align-items-center text-dark fw-bold bg-white bg-opacity-50 rounded-3 px-3 py-2 border border-dark border-opacity-10 style-salario" style={{ width: 'fit-content' }}>
                                                        <span className="text-success small fw-semibold me-1">R$</span> 
                                                        <span>{vaga.salario}</span>
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-2 align-self-stretch align-self-md-center justify-content-end" style={{ minWidth: 'fit-content' }}>
                                                    <button
                                                        className="btn btn-outline-danger bg-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium shadow-sm"
                                                        onClick={() => excluirVaga(vaga.id)}
                                                    >
                                                        <i className="bi bi-trash-fill" /> Excluir vaga
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {vagas.length === 0 && (
                                <div className="text-center py-5 border border-dashed rounded-4 bg-white bg-opacity-50 mt-2">
                                    <i className="bi bi-archive display-3 text-muted" />
                                    <h5 className="fw-bold mt-3 text-dark">Nenhuma vaga encontrada</h5>
                                    <p className="text-muted px-3 mb-0">O banco de dados não retornou registros de vagas no momento.</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}