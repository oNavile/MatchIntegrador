"use client";

import React, { useState, useEffect } from "react";

export default function DashboardEmpresa() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function carregar() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "http://localhost:3001/api/dashboard/empresa",
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
                    <div className="row align-items-center g-5 mb-5">
                        <div className="col-xl-7">
                            <span className="badge rounded-pill bg-success bg-opacity-25 text-success px-3 py-2 mb-4 fw-semibold border border-success border-opacity-10">
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
                                    href="/vagasEmpresa"
                                    className="btn btn-segundo btn-lg px-4 fw-semibold"
                                >
                                    Minhas Vagas
                                </a>

                                <a
                                    href="/cadastrarVaga"
                                    className="btn btn-segundo btn-lg px-4 fw-semibold"
                                >
                                    Criar Vaga
                                </a>

                                <a
                                    href="/empresaCandidatos"
                                    className="btn btn-segundo btn-lg px-4 fw-semibold"
                                >
                                    Funcionários
                                </a>
                            </div>
                        </div>
<div className="col-xl-5">
    <div className="row g-4">
        <div className="col-12">
            <div className="card h-100 border-0 bg-white bg-opacity-10 text-white rounded-4 shadow">
                <div className="card-body p-4 d-flex align-items-center gap-3">
                    <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                        <i className="bi bi-building fs-3 text-white" aria-hidden="true"></i>
                    </div>
                    <div>
                        <p className="text-white-50 text-uppercase fw-semibold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                            Empresa Atual
                        </p>
                        <h3 className="fw-bold mb-0 text-truncate">
                            {data?.empresa || "Minha Empresa"}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-6">
            <div className="card h-100 border-0 bg-white bg-opacity-10 text-white rounded-4 shadow">
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <p className="text-white-50 fw-semibold mb-0">Vagas Ativas</p>
                        <div className="bg-success bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center p-2">
                            <i className="bi bi-briefcase-fill fs-5 text-success" aria-hidden="true"></i>
                        </div>
                    </div>
                    <h2 className="fw-bold mb-0 display-6">
                        {data?.totalVagas || 0}
                    </h2>
                </div>
            </div>
        </div>
        <div className="col-6">
            <div className="card h-100 border-0 bg-white bg-opacity-10 text-white rounded-4 shadow">
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <p className="text-white-50 fw-semibold mb-0">Candidatos</p>
                        <div className="bg-primary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center p-2">
                            <i className="bi bi-people-fill fs-5 text-info" aria-hidden="true"></i>
                        </div>
                    </div>
                    <h2 className="fw-bold mb-0 display-6">
                        {data?.totalCandidaturas || 0}
                    </h2>
                </div>
            </div>
        </div>
        <div className="col-12">
            <div className="card border-0 bg-white bg-opacity-10 text-white rounded-4 shadow">
                <div className="card-body p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <p className="text-white-50 fw-semibold mb-1">Funcionários Ativos</p>
                        <h2 className="fw-bold mb-0">
                            {data?.totalFuncionarios || 0}
                        </h2>
                    </div>
                    <div className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                        <i className="bi bi-person-check-fill fs-2 text-warning" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
</div>
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

                                      <div className="lista mb-2">
          <div className="item">
            <img src="../1.png" alt="MAt" />
            <p>
              A MatchHire conecta empresas e candidatos de forma rápida, moderna
              e eficiente. Nossa plataforma facilita o recrutamento, tornando a
              busca por talentos muito mais simples e prática.
            </p>
          </div>
          <div className="lista">
            <div className="item">
              <img src="../2.png" alt="chH" />
              <p>
                Na MatchHire, empresas encontram profissionais qualificados e
                candidatos descobrem novas oportunidades de carreira. Tudo em um
                ambiente intuitivo e acessível.
              </p>
            </div>
          </div>
          <div className="lista">
            <div className="item">
              <img src="../3.png" alt="ire" />
              <p>
                A MatchHire foi criada para transformar o processo de
                contratação, aproximando talentos e empresas através de
                tecnologia, agilidade e inovação.
              </p>
            </div>
          </div>
        </div>



                </div>
            </div>
        </main>
    );
}