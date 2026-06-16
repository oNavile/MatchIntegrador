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
            <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
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
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0
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
                                        <i className="bi bi-bar-chart-line-fill me-2 text-success" />
                                        Relatórios do Sistema
                                    </h2>
                                    <p className="text-muted small mb-0">
                                        Visualize indicadores, desempenho das empresas, engajamento em vagas e estatísticas de contratações realizadas no MatchHire.
                                    </p>
                                </div>
                                <div className="mt-3 mt-md-0">
                                    <span className="badge bg-dark rounded-pill px-4 py-2 shadow-sm text-white fw-bold">
                                        Painel Administrativo
                                    </span>
                                </div>
                            </div>
                            <div className="row g-4 mb-5">
                                <div className="col-6 col-xl-3">
                                    <div className="card border-0 rounded-4 shadow-sm h-100" style={{ backgroundColor: "#EAF2F0" }}>
                                        <div className="card-body text-center p-4">
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 60, height: 60 }}>
                                                <i className="bi bi-building fs-3 text-success"></i>
                                            </div>
                                            <h2 className="fw-bold text-dark font-georgia mb-1">
                                                {dados?.resumo?.totalEmpresas || 0}
                                            </h2>
                                            <p className="text-muted small fw-medium text-uppercase mb-0">Empresas</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6 col-xl-3">
                                    <div className="card border-0 rounded-4 shadow-sm h-100" style={{ backgroundColor: "#EAF2F0" }}>
                                        <div className="card-body text-center p-4">
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 60, height: 60 }}>
                                                <i className="bi bi-people-fill fs-3 text-success"></i>
                                            </div>
                                            <h2 className="fw-bold text-dark font-georgia mb-1">
                                                {dados?.resumo?.totalCandidatos || 0}
                                            </h2>
                                            <p className="text-muted small fw-medium text-uppercase mb-0">Candidatos</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6 col-xl-3">
                                    <div className="card border-0 rounded-4 shadow-sm h-100" style={{ backgroundColor: "#EAF2F0" }}>
                                        <div className="card-body text-center p-4">
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 60, height: 60 }}>
                                                <i className="bi bi-briefcase-fill fs-3 text-success"></i>
                                            </div>
                                            <h2 className="fw-bold text-dark font-georgia mb-1">
                                                {dados?.resumo?.totalVagas || 0}
                                            </h2>
                                            <p className="text-muted small fw-medium text-uppercase mb-0">Vagas Ativas</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6 col-xl-3">
                                    <div className="card border-0 rounded-4 shadow-sm h-100" style={{ backgroundColor: "#EAF2F0" }}>
                                        <div className="card-body text-center p-4">
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 60, height: 60 }}>
                                                <i className="bi bi-person-check-fill fs-3 text-success"></i>
                                            </div>
                                            <h2 className="fw-bold text-dark font-georgia mb-1">
                                                {dados?.resumo?.totalFuncionarios || 0}
                                            </h2>
                                            <p className="text-muted small fw-medium text-uppercase mb-0">Funcionários</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-5">
                                <div className="col-12 col-xl-6">
                                    <div className="card border-0 rounded-4 shadow-sm h-100 bg-white">
                                        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2">
                                            <h5 className="fw-bold text-dark font-georgia mb-0">
                                                <i className="bi bi-buildings me-2 text-success" /> Atividade por Empresa
                                            </h5>
                                        </div>
                                        <div className="card-body px-4 pb-4">
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle mb-0">
                                                    <thead>
                                                        <tr className="text-secondary small text-uppercase">
                                                            <th className="border-bottom pb-3">Empresa</th>
                                                            <th className="border-bottom pb-3 text-center">Vagas</th>
                                                            <th className="border-bottom pb-3 text-center">Funcionários</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dados?.empresas?.map((empresa) => (
                                                            <tr key={empresa.id}>
                                                                <td className="fw-semibold text-dark py-3">{empresa.nome}</td>
                                                                <td className="text-center py-3"><span className="badge bg-light text-dark px-3 py-1 border">{empresa.total_vagas}</span></td>
                                                                <td className="text-center py-3"><span className="badge bg-success bg-opacity-10 text-success px-3 py-1 fw-bold">{empresa.total_funcionarios}</span></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-xl-6">
                                    <div className="card border-0 rounded-4 shadow-sm h-100 bg-white">
                                        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2">
                                            <h5 className="fw-bold text-dark font-georgia mb-0">
                                                <i className="bi bi-fire me-2 text-danger" /> Vagas Mais Procuradas
                                            </h5>
                                        </div>
                                        <div className="card-body px-4 pb-4">
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle mb-0">
                                                    <thead>
                                                        <tr className="text-secondary small text-uppercase">
                                                            <th className="border-bottom pb-3">Vaga</th>
                                                            <th className="border-bottom pb-3">Empresa</th>
                                                            <th className="border-bottom pb-3 text-center">Candidaturas</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dados?.vagas?.map((vaga) => (
                                                            <tr key={vaga.id}>
                                                                <td className="fw-semibold text-dark py-3">{vaga.titulo}</td>
                                                                <td className="text-secondary py-3">{vaga.empresa}</td>
                                                                <td className="text-center py-3">
                                                                    <span className="badge bg-dark rounded-pill text-white px-3 py-1 fw-bold">
                                                                        {vaga.candidaturas} <i className="bi bi-box-arrow-in-right small ms-1" />
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="card border-0 rounded-4 shadow-sm bg-white">
                                        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2">
                                            <h5 className="fw-bold text-dark font-georgia mb-0">
                                                <i className="bi bi-award-fill me-2 text-warning" /> Histórico de Contratações Efetivadas
                                            </h5>
                                        </div>
                                        <div className="card-body px-4 pb-4">
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle mb-0">
                                                    <thead>
                                                        <tr className="text-secondary small text-uppercase">
                                                            <th className="border-bottom pb-3">Corporação / Empresa</th>
                                                            <th className="border-bottom pb-3 text-end pe-4">Total de Contratações Concluídas</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dados?.contratacoes?.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="fw-bold text-dark py-3">
                                                                    <i className="bi bi-patch-check-fill text-success me-2" />
                                                                    {item.nome}
                                                                </td>
                                                                <td className="text-end py-3 pe-4">
                                                                    <span className="fs-5 fw-bold text-success font-georgia">
                                                                        {item.total_contratacoes}
                                                                    </span>
                                                                    <span className="text-muted small ms-2">admitidos</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}