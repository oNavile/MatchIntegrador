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
            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-success"></div>
            </main>
        );
    }

    return (
        <main
            className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4"
        >
            <div  id="main-content" className="container-fluid">

                <div
                    className="p-4 shadow-lg text-white cor-main"
                    style={{
                        borderTopLeftRadius: 30
                    }}
                >

                    <h1 className="fw-bold mb-4">
                        Gerenciar Vagas
                    </h1>

                    <div className="card shadow border-0">
                        <div className="card-body">

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Título</th>
                                            <th>Empresa</th>
                                            <th>Tipo</th>
                                            <th>Status</th>
                                            <th>Salário</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {vagas.map((vaga) => (
                                            <tr key={vaga.id}>

                                                <td>{vaga.id}</td>

                                                <td>
                                                    {vaga.titulo}
                                                </td>

                                                <td>
                                                    {vaga.empresa}
                                                </td>

                                                <td>
                                                    {vaga.tipo}
                                                </td>

                                                <td>
                                                    {vaga.status}
                                                </td>

                                                <td>
                                                    R$ {vaga.salario}
                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            excluirVaga(vaga.id)
                                                        }
                                                    >
                                                        Excluir
                                                    </button>

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
        </main>
    );
}