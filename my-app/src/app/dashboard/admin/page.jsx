"use client";

import React, { useState, useEffect } from "react";

export default function dashboardAdmin() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregar() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    "http://localhost:3001/api/dashboard/admin",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const json = await res.json();

                if (res.ok) {
                    setData(json);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        carregar();
    }, []);

    if (loading) {
        return (
            <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">
                        Carregando...
                    </span>
                </div>
            </main>
        );
    }

    return (
        <main
            id="main-content"
            className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4"
        >
            <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
                <div
                    className="p-4 p-md-5 shadow-lg text-white cor-main d-flex flex-column flex-grow-1"
                    style={{
                        borderRadius: 0,
                        borderTopLeftRadius: 30
                    }}
                >
                    {/* HERO */}
                    <div className="row align-items-center g-5 mb-5">
                        <div className="col-xl-7">
                            <span className="badge rounded-pill bg-success-subtle text-success-emphasis px-3 py-2 mb-4 fw-semibold">
                                Painel Corporativo MatchHire
                            </span>

                            <h1 className="display-3 fw-bold lh-1 mb-4">
                                Encontre os
                                <span className="text-success">
                                    {" "}melhores talentos
                                </span>
                            </h1>

                            <p className="fs-5 text-white-50 lh-lg col-lg-10 mb-4">
                                Gerencie vagas, acompanhe candidatos,
                                visualize matchs e realize admissões
                                diretamente pela plataforma.
                            </p>

                            <div className="d-flex flex-wrap gap-3">
                                <a
                                    href="/Empresas"
                                    className="btn btn-segundo btn-lg px-4 fw-semibold"
                                >
                                    Empresas
                                </a>

                                <a
                                    href="/Candidatos"
                                    className="btn btn-segundo btn-lg px-4 fw-semibold"
                                >
                                    Candidatos
                                </a>

                                <a
                                    href="/Vagas"
                                    className="btn btn-segundo btn-lg px-4 fw-semibold"
                                >
                                    Vagas
                                </a>
                            </div>
                        </div>

                        {/* Cards Estatísticos */}
                        <div className="col-xl-5">
                            <div className="row g-3">

                                <div className="col-6">
                                    <div className="card border-0 shadow-lg">
                                        <div className="card-body text-center">
                                            <i className="bi bi-buildings fs-1 text-primary"></i>

                                            <h2 className="fw-bold mt-2">
                                                {data?.totalEmpresas || 0}
                                            </h2>

                                            <p className="text-muted mb-0">
                                                Empresas
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="card border-0 shadow-lg">
                                        <div className="card-body text-center">
                                            <i className="bi bi-people-fill fs-1 text-success"></i>

                                            <h2 className="fw-bold mt-2">
                                                {data?.totalCandidatos || 0}
                                            </h2>

                                            <p className="text-muted mb-0">
                                                Candidatos
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="card border-0 shadow-lg">
                                        <div className="card-body text-center">
                                            <i className="bi bi-briefcase-fill fs-1 text-warning"></i>

                                            <h2 className="fw-bold mt-2">
                                                {data?.totalVagas || 0}
                                            </h2>

                                            <p className="text-muted mb-0">
                                                Vagas
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="card border-0 shadow-lg">
                                        <div className="card-body text-center">
                                            <i className="bi bi-person-check-fill fs-1 text-danger"></i>

                                            <h2 className="fw-bold mt-2">
                                                {data?.totalFuncionarios || 0}
                                            </h2>

                                            <p className="text-muted mb-0">
                                                Funcionários
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* SOBRE */}
                    <section className="py-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-5">
                                    <span className="text-muted">
                                        Gestão inteligente
                                    </span>

                                    <h2 className="display-5 fw-bold">
                                        Seu RH mais eficiente
                                    </h2>

                                    <p className="lead">
                                        Utilize a inteligência da MatchHire
                                        para encontrar candidatos compatíveis
                                        com suas oportunidades.
                                    </p>
                                </div>

                                <div className="col-md-6 offset-md-1">
                                    <p className="lead">
                                        Publique vagas, receba candidaturas,
                                        acompanhe o ranking de compatibilidade
                                        e contrate profissionais diretamente
                                        pela plataforma.
                                    </p>

                                    <p className="lead">
                                        Todo o processo de recrutamento e
                                        seleção centralizado em um único lugar,
                                        proporcionando mais produtividade
                                        para sua equipe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RECURSOS */}
                    <div className="row g-4 mt-4">

                        <div className="col-md-4">
                            <div className="card h-100 shadow border-0">
                                <div className="card-body text-dark">
                                    <i className="bi bi-lightning-charge-fill fs-1 text-success"></i>

                                    <h4 className="mt-3">
                                        Match Inteligente
                                    </h4>

                                    <p>
                                        Encontre automaticamente os candidatos
                                        mais compatíveis para cada vaga.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow border-0">
                                <div className="card-body text-dark">
                                    <i className="bi bi-person-check-fill fs-1 text-primary"></i>

                                    <h4 className="mt-3">
                                        Admissão Rápida
                                    </h4>

                                    <p>
                                        Contrate colaboradores diretamente
                                        pelo painel corporativo.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow border-0">
                                <div className="card-body text-dark">
                                    <i className="bi bi-graph-up-arrow fs-1 text-warning"></i>

                                    <h4 className="mt-3">
                                        Gestão Completa
                                    </h4>

                                    <p>
                                        Controle vagas, funcionários e
                                        processos seletivos em tempo real.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}