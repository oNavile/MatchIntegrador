"use client";

import { useEffect, useState } from "react";

export default function GerenciarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const [busca, setBusca] = useState("");

    const [usuarioEditando, setUsuarioEditando] = useState(null);

    const [formEdit, setFormEdit] = useState({
        email: "",
        tipo: "",
        ativo: 1
    });

    async function carregarUsuarios() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "http://localhost:3001/api/admin/usuarios",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const json = await res.json();

            if (res.ok) {
                setUsuarios(json);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const abrirEdicao = (usuario) => {
        setUsuarioEditando(usuario);

        setFormEdit({
            email: usuario.email || "",
            tipo: usuario.tipo || "",
            ativo: usuario.ativo
        });
    };

    const salvarEdicao = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:3001/api/admin/usuarios/${usuarioEditando.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formEdit)
                }
            );

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.erro);
            }

            alert("Usuário atualizado com sucesso!");

            setUsuarioEditando(null);

            carregarUsuarios();
        } catch (err) {
            alert(err.message);
        }
    };

    const excluirUsuario = async (id) => {
        const confirmar = window.confirm(
            "Deseja realmente excluir este usuário?"
        );

        if (!confirmar) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:3001/api/admin/usuarios/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.erro);
            }

            alert("Usuário removido!");

            carregarUsuarios();
        } catch (err) {
            alert(err.message);
        }
    };

    const usuariosFiltrados = usuarios.filter((u) => {
        const termo = busca.toLowerCase();

        return (
            String(u.id).includes(termo) ||
            (u.email || "").toLowerCase().includes(termo) ||
            (u.tipo || "").toLowerCase().includes(termo)
        );
    });

    if (loading) {
        return (
            <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
                <div className="spinner-border text-success" />
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
                    {/* HEADER */}
                    <div className="row align-items-center mb-5">
                        <div className="col-lg-8">
                            <span className="badge rounded-pill bg-danger-subtle text-danger-emphasis px-3 py-2 mb-3">
                                Painel Administrativo
                            </span>

                            <h1 className="display-4 fw-bold">
                                Gerenciar Usuários
                            </h1>

                            <p className="text-white-50 fs-5">
                                Visualize, edite, ative, desative e remova
                                usuários da plataforma MatchHire.
                            </p>
                        </div>

                        <div className="col-lg-4">
                            <div className="card border-0 shadow">
                                <div className="card-body text-center text-dark">
                                    <i className="bi bi-people-fill fs-1 text-primary"></i>

                                    <h2 className="fw-bold mt-2">
                                        {usuarios.length}
                                    </h2>

                                    <p className="text-muted mb-0">
                                        Usuários cadastrados
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BUSCA */}
                    <div className="card shadow border-0 mb-4">
                        <div className="card-body">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar por ID, email ou tipo..."
                                value={busca}
                                onChange={(e) =>
                                    setBusca(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* TABELA */}
                    <div className="card border-0 shadow">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Email</th>
                                            <th>Tipo</th>
                                            <th>Status</th>
                                            <th>Criado em</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {usuariosFiltrados.map((usuario) => (
                                            <tr key={usuario.id}>
                                                <td>
                                                    {usuario.id}
                                                </td>

                                                <td>
                                                    {usuario.email}
                                                </td>

                                                <td>
                                                    <span className="badge bg-primary">
                                                        {usuario.tipo}
                                                    </span>
                                                </td>

                                                <td>
                                                    {usuario.ativo ? (
                                                        <span className="badge bg-success">
                                                            Ativo
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-danger">
                                                            Inativo
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        usuario.criado_em
                                                    ).toLocaleDateString(
                                                        "pt-BR"
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() =>
                                                                abrirEdicao(
                                                                    usuario
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-pencil-fill"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                excluirUsuario(
                                                                    usuario.id
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-trash-fill"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {usuariosFiltrados.length === 0 && (
                                    <div className="text-center py-5">
                                        Nenhum usuário encontrado.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MODAL */}
                    {usuarioEditando && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100"
                            style={{
                                background: "rgba(0,0,0,0.5)",
                                zIndex: 9999
                            }}
                        >
                            <div className="container h-100 d-flex justify-content-center align-items-center">
                                <div
                                    className="card shadow-lg"
                                    style={{
                                        width: "500px"
                                    }}
                                >
                                    <div className="card-body">
                                        <h3 className="mb-4">
                                            Editar Usuário
                                        </h3>

                                        <div className="mb-3">
                                            <label>
                                                Email
                                            </label>

                                            <input
                                                className="form-control"
                                                value={formEdit.email}
                                                onChange={(e) =>
                                                    setFormEdit({
                                                        ...formEdit,
                                                        email:
                                                            e.target.value
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label>
                                                Tipo
                                            </label>

                                            <select
                                                className="form-select"
                                                value={formEdit.tipo}
                                                onChange={(e) =>
                                                    setFormEdit({
                                                        ...formEdit,
                                                        tipo:
                                                            e.target.value
                                                    })
                                                }
                                            >
                                                <option value="admin">
                                                    Admin
                                                </option>

                                                <option value="empresa">
                                                    Empresa
                                                </option>

                                                <option value="candidato">
                                                    Candidato
                                                </option>
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label>
                                                Status
                                            </label>

                                            <select
                                                className="form-select"
                                                value={formEdit.ativo}
                                                onChange={(e) =>
                                                    setFormEdit({
                                                        ...formEdit,
                                                        ativo:
                                                            Number(
                                                                e.target
                                                                    .value
                                                            )
                                                    })
                                                }
                                            >
                                                <option value={1}>
                                                    Ativo
                                                </option>

                                                <option value={0}>
                                                    Inativo
                                                </option>
                                            </select>
                                        </div>

                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    setUsuarioEditando(
                                                        null
                                                    )
                                                }
                                            >
                                                Cancelar
                                            </button>

                                            <button
                                                className="btn btn-success"
                                                onClick={salvarEdicao}
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}