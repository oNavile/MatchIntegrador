"use client";

import { useEffect, useState } from "react";

export default function RelatoriosAdmin() {

const [dados, setDados] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    carregarRelatorios();
}, []);

async function carregarRelatorios() {
    try {

        const token = localStorage.getItem("token");

        const res = await fetch(
            "http://localhost:3001/api/admin/relatorios",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const json = await res.json();

        if (res.ok) {
            setDados(json);
        }

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
}

if (loading) {
    return (
        <main
            id="main-content"
            className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5"
        >
            <div
                className="spinner-border text-success"
                role="status"
            >
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
        <div className="container-fluid px-4">

            <div
                className="cor-main text-white shadow-lg p-4 p-md-5"
                style={{
                    borderRadius: 0,
                    borderTopLeftRadius: 30
                }}
            >

                {/* HERO */}

                <div className="row align-items-center mb-5">

                    <div className="col-lg-8">

                        <span className="badge bg-success mb-3">
                            Relatórios Administrativos
                        </span>

                        <h1 className="display-4 fw-bold">
                            Relatórios do Sistema
                        </h1>

                        <p className="lead text-white-50">
                            Visualize indicadores,
                            desempenho das empresas,
                            vagas publicadas e
                            contratações realizadas.
                        </p>

                    </div>

                </div>

                {/* CARDS */}

                <div className="row g-4 mb-5">

                    <div className="col-md-3">
                        <div className="card border-0 shadow h-100">
                            <div className="card-body text-center">

                                <i className="bi bi-building fs-1 text-success"></i>

                                <h2 className="fw-bold mt-3">
                                    {dados?.resumo?.totalEmpresas || 0}
                                </h2>

                                <p className="text-muted mb-0">
                                    Empresas
                                </p>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow h-100">
                            <div className="card-body text-center">

                                <i className="bi bi-people-fill fs-1 text-primary"></i>

                                <h2 className="fw-bold mt-3">
                                    {dados?.resumo?.totalCandidatos || 0}
                                </h2>

                                <p className="text-muted mb-0">
                                    Candidatos
                                </p>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow h-100">
                            <div className="card-body text-center">

                                <i className="bi bi-briefcase-fill fs-1 text-warning"></i>

                                <h2 className="fw-bold mt-3">
                                    {dados?.resumo?.totalVagas || 0}
                                </h2>

                                <p className="text-muted mb-0">
                                    Vagas
                                </p>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow h-100">
                            <div className="card-body text-center">

                                <i className="bi bi-person-check-fill fs-1 text-danger"></i>

                                <h2 className="fw-bold mt-3">
                                    {dados?.resumo?.totalFuncionarios || 0}
                                </h2>

                                <p className="text-muted mb-0">
                                    Funcionários
                                </p>

                            </div>
                        </div>
                    </div>

                </div>

                {/* EMPRESAS */}

                <div className="card border-0 shadow mb-5">

                    <div className="card-header bg-white">

                        <h4 className="fw-bold mb-0 text-dark">
                            Empresas
                        </h4>

                    </div>

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-hover">

                                <thead>

                                    <tr>
                                        <th>Empresa</th>
                                        <th>Vagas</th>
                                        <th>Funcionários</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {dados?.empresas?.map((empresa) => (

                                        <tr key={empresa.id}>

                                            <td>{empresa.nome}</td>

                                            <td>
                                                {empresa.total_vagas}
                                            </td>

                                            <td>
                                                {empresa.total_funcionarios}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                {/* VAGAS */}

                <div className="card border-0 shadow mb-5">

                    <div className="card-header bg-white">

                        <h4 className="fw-bold mb-0 text-dark">
                            Vagas Mais Procuradas
                        </h4>

                    </div>

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-hover">

                                <thead>

                                    <tr>
                                        <th>Vaga</th>
                                        <th>Empresa</th>
                                        <th>Candidaturas</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {dados?.vagas?.map((vaga) => (

                                        <tr key={vaga.id}>

                                            <td>{vaga.titulo}</td>

                                            <td>{vaga.empresa}</td>

                                            <td>
                                                {vaga.candidaturas}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                {/* CONTRATAÇÕES */}

                <div className="card border-0 shadow">

                    <div className="card-header bg-white">

                        <h4 className="fw-bold mb-0 text-dark">
                            Contratações
                        </h4>

                    </div>

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-hover">

                                <thead>

                                    <tr>
                                        <th>Empresa</th>
                                        <th>Total</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {dados?.contratacoes?.map(
                                        (item, index) => (

                                            <tr key={index}>

                                                <td>{item.nome}</td>

                                                <td>
                                                    {item.total_contratacoes}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    </main>
);
}
