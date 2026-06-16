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
                    className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1"
                    style={{
                        backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
                        borderRadius: 0,
                        borderTopLeftRadius: 30
                    }}
                >
                    <div className="row align-items-center g-5 mb-5 border-bottom border-white-10 pb-5">
                        <div className="col-xl-7">
                            <span className="badge rounded-pill bg-success bg-opacity-25 text-success px-3 py-2 mb-4 fw-semibold border border-success border-opacity-10">
                                Painel Administrativo MatchHire
                            </span>

                            <h1 className="font-georgia display-3 fw-bold lh-1 mb-4">
                                Gerencie empresas
                                <span className="text-success">
                                    {" "}e candidatos
                                </span>
                            </h1>

                            <p className="fs-5 text-white-50 lh-lg col-lg-10 mb-4">
                                Gerencie vagas, candidatos, e empresas por esse site.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <a
                                    href="../Admin/Usuarios"
                                    className="btn btn-segundo btn-lg px-4 fw-semibold"
                                >
                                    Usuarios
                                </a>

                                <a
                                    href="../Admin/Vagas"
                                    className="btn btn-segundo btn-lg px-4 fw-semibold"
                                >
                                    Vagas
                                </a>

                                <a
                                    href="../cursosAdmin"
                                    className="btn btn-segundo btn-lg px-4 fw-semibold"
                                >
                                    Cursos
                                </a>
                            </div>
                        </div>
                        <div className="col-xl-5">
                            <div className="row g-3">

                                <div className="col-6">
                                    <div className="card border-0 rounded-4 shadow bg-white bg-opacity-10 text-white">
                                        <div className="card-body text-center p-4">
                                            <i className="bi bi-buildings fs-1 text-info opacity-75"></i>
                                            <h2 className="fw-bold mt-2 font-georgia">
                                                {data?.totalEmpresas || 0}
                                            </h2>
                                            <p className="text-white-50 small mb-0">
                                                Empresas
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="card border-0 rounded-4 shadow bg-white bg-opacity-10 text-white">
                                        <div className="card-body text-center p-4">
                                            <i className="bi bi-people-fill fs-1 text-success opacity-75"></i>
                                            <h2 className="fw-bold mt-2 font-georgia">
                                                {data?.totalCandidatos || 0}
                                            </h2>
                                            <p className="text-white-50 small mb-0">
                                                Candidatos
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="card border-0 rounded-4 shadow bg-white bg-opacity-10 text-white">
                                        <div className="card-body text-center p-4">
                                            <i className="bi bi-briefcase-fill fs-1 text-warning opacity-75"></i>
                                            <h2 className="fw-bold mt-2 font-georgia">
                                                {data?.totalVagas || 0}
                                            </h2>
                                            <p className="text-white-50 small mb-0">
                                                Vagas
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="card border-0 rounded-4 shadow bg-white bg-opacity-10 text-white">
                                        <div className="card-body text-center p-4">
                                            <i className="bi bi-person-check-fill fs-1 text-danger opacity-75"></i>
                                            <h2 className="fw-bold mt-2 font-georgia">
                                                {data?.totalFuncionarios || 0}
                                            </h2>
                                            <p className="text-white-50 small mb-0">
                                                Funcionários
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

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