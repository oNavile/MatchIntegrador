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
                    {/* Cabeçalho */}
                    <div className="mb-5">
                        <span className="badge rounded-pill bg-success-subtle text-success-emphasis px-3 py-2 mb-3">
                            Gestão de Talentos
                        </span>

                        <h1 className="display-4 fw-bold">
                            Candidatos e
                            <span className="text-success">
                                {" "}Funcionários
                            </span>
                        </h1>

                        <p className="fs-5 text-white-50">
                            Visualize todos os profissionais vinculados à sua empresa.
                        </p>
                    </div>

                    {loading && (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border text-success"
                                role="status"
                            />
                        </div>
                    )}

                    {!loading && candidatos.length === 0 && (
                        <div className="alert alert-light text-center">
                            Nenhum candidato encontrado.
                        </div>
                    )}

                    <div className="row g-4">
                        {candidatos.map((cand) => (
                            <div
                                key={cand.id}
                                className="col-lg-6"
                            >
                                <div className="card border-0 shadow-lg h-100">
                                    <div className="card-body p-4">

                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h4 className="fw-bold">
                                                    {cand.nome}
                                                </h4>

                                                <p className="text-muted mb-0">
                                                    {cand.email}
                                                </p>
                                            </div>

                                            <span className="badge bg-success">
                                                {cand.status}
                                            </span>
                                        </div>

                                        <hr />

                                        <div className="row g-3">

                                            <div className="col-12">
                                                <small className="text-muted">
                                                    Admissão
                                                </small>

                                                <div className="fw-semibold">
                                                    {cand.data_admissao
                                                        ? new Date(
                                                              cand.data_admissao
                                                          ).toLocaleDateString(
                                                              "pt-BR"
                                                          )
                                                        : "-"}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}