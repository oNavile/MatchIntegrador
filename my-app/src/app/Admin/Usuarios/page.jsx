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
                                        <i className="bi bi-people-fill me-2 text-success" />
                                        Controle Geral de Usuários
                                    </h2>
                                    <p className="text-muted small mb-0">
                                        Gerencie as credenciais, níveis de acesso e atividade dos usuários cadastrados na MatchHire.
                                    </p>
                                </div>
                                <div className="mt-3 mt-md-0">
                                    <span className="badge bg-dark rounded-pill px-4 py-2 shadow-sm text-white fw-bold">
                                        {usuarios.length} Usuário(s) no Total
                                    </span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                    <span className="input-group-text bg-white border-0 text-muted ps-3">
                                        <i className="bi bi-search" />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-0 py-2 ps-2"
                                        placeholder="Pesquisar por ID, e-mail ou tipo de conta..."
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                            </div>
                            <div className="row g-4">
                                {usuariosFiltrados.map((usuario) => (
                                    <div key={usuario.id} className="col-12">
                                        <div className="card border-0 rounded-4 shadow-sm w-100" style={{ backgroundColor: "#EAF2F0" }}>
                                            <div className="card-body p-4 d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-4">
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 text-uppercase fw-bold border border-success border-opacity-25 small">
                                                            {usuario.tipo}
                                                        </span>
                                                        {usuario.ativo ? (
                                                            <span className="badge bg-success rounded-pill px-2 py-1 small">Ativo</span>
                                                        ) : (
                                                            <span className="badge bg-danger rounded-pill px-2 py-1 small">Inativo</span>
                                                        )}
                                                        <span className="text-muted small fw-medium ms-auto ms-md-0">
                                                            ID: #{usuario.id}
                                                        </span>
                                                    </div>

                                                    <h4 className="fw-bold mb-2 text-dark font-georgia">{usuario.email}</h4>

                                                    {usuario.criado_em && (
                                                        <div className="text-secondary small">
                                                            <i className="bi bi-calendar3 me-1 text-success" /> 
                                                            Cadastrado em: {new Date(usuario.criado_em).toLocaleDateString("pt-BR")}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="d-flex flex-wrap gap-2 align-self-start align-self-xl-center" style={{ minWidth: 'fit-content' }}>
                                                    <button
                                                        className="btn btn-dark d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm fw-bold"
                                                        onClick={() => abrirEdicao(usuario)}
                                                    >
                                                        <i className="bi bi-pencil-square" /> Editar Cadastro
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger bg-white px-3 py-2 rounded-3 fw-medium"
                                                        onClick={() => excluirUsuario(usuario.id)}
                                                    >
                                                        <i className="bi bi-trash" /> Excluir
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {usuariosFiltrados.length === 0 && (
                                <div className="text-center py-5 border border-dashed rounded-4 bg-white bg-opacity-50 mt-3">
                                    <i className="bi bi-person-x display-3 text-muted" />
                                    <h5 className="fw-bold mt-3 text-dark">Nenhum usuário encontrado</h5>
                                    <p className="text-muted px-3 mb-0">Não foram encontrados registros para o termo pesquisado.</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
            {usuarioEditando && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 text-dark shadow-lg bg-white">
                            <div className="modal-header border-bottom p-4 bg-light">
                                <h4 className="modal-title fw-bold text-dark font-georgia">
                                    <i className="bi bi-person-gear text-success me-2" />
                                    Modificar Registro
                                </h4>
                                <button type="button" className="btn-close" onClick={() => setUsuarioEditando(null)} />
                            </div>

                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-secondary">Endereço de E-mail</label>
                                    <input 
                                        type="email"
                                        className="form-control rounded-3" 
                                        value={formEdit.email}
                                        onChange={(e) => setFormEdit({ ...formEdit, email: e.target.value })} 
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-secondary">Tipo de Perfil / Permissão</label>
                                    <select 
                                        className="form-select rounded-3" 
                                        value={formEdit.tipo}
                                        onChange={(e) => setFormEdit({ ...formEdit, tipo: e.target.value })}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="empresa">Empresa</option>
                                        <option value="candidato">Candidato</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-secondary">Status do Acesso</label>
                                    <select 
                                        className="form-select rounded-3" 
                                        value={formEdit.ativo}
                                        onChange={(e) => setFormEdit({ ...formEdit, ativo: Number(e.target.value) })}
                                    >
                                        <option value={1}>Ativo</option>
                                        <option value={0}>Inativo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer border-top p-3 bg-light">
                                <button type="button" className="btn btn-secondary px-4 rounded-3" onClick={() => setUsuarioEditando(null)}>Cancelar</button>
                                <button type="button" className="btn btn-success fw-bold px-4 rounded-3 shadow-sm" onClick={salvarEdicao}>Salvar Alterações</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}