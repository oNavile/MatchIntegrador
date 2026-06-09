"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function editarPerfilEmpresa() {
    // --- ESTADOS ---
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [nomeOriginal, setNomeOriginal] = useState("Seu Nome");

    // Estado para controlar os campos de texto do formulário
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        cnpj: "",
        telefone: "",
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        descricao: ""
    });

    // --- 1. BUSCAR DADOS DO BANCO AO CARREGAR A PÁGINA ---
    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                console.log("Valor do token antes do fetch:", token);

                const res = await fetch("http://localhost:3001/api/perfil", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                if (res.ok) {
                    // O backend retorna cidade e estado separados, mas o front exibe junto (Ex: São Paulo - SP)
                    const cidadeFormatada = data.cidade && data.estado
                        ? `${data.cidade} - ${data.estado}`
                        : (data.cidade || "");

                    setNomeOriginal(data.nome || "Seu Nome");

                    setFormData({
                        nome: data.nome || "",
                        email: data.email || "",
                        cnpj: data.cnpj || "",
                        telefone: data.telefone || "",
                        cep: data.cep || "",
                        rua: data.rua || "",
                        numero: data.numero || "",
                        bairro: data.bairro || "",
                        cidade: data.cidade || "",
                        estado: data.estado || "",
                        descricao: data.descricao || ""
                    });

                    if (data.palavras_chave) {
                        setTags(data.palavras_chave);
                    }

                    if (data.arquivo) {
                        // Supondo que a sua rota estática de uploads seja essa
                        setImagePreview(`http://localhost:3001/uploads/${data.arquivo}`);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, []);

    // Função para aplicar máscara de telefone: (XX) XXXXX-XXXX
    const phoneMask = (value) => {
        if (!value) return "";
        return value
            .replace(/\D/g, '') // Remove tudo o que não é número
            .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses no DDD
            .replace(/(\d{5})(\d{4})\d+?$/, '$1-$2'); // Coloca o hífen no meio
    };

    // Handler para atualizar os campos de texto conforme o usuário digita
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Aplica a máscara se o campo for o de telefone
        const newValue = name === "telefone" ? phoneMask(value) : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    // Handler para Upload da Imagem (Apenas Preview)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handler para Adicionar Tag (Enter ou Vírgula)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            let val = inputValue.trim().replace(/,/g, '');

            if (tags.length >= 8) return;

            if (val && !tags.includes(val)) {
                setTags([...tags, val]);
                setInputValue('');
            }
        }
    };

    // Handler para Remover Tag
    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleCancel = (e) => {
        const confirmar = window.confirm("Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas.");
        if (!confirmar) e.preventDefault();
    };

    // --- 2. ENVIAR DADOS ATUALIZADOS PARA O BANCO ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Montamos o FormData manualmente a partir do estado controlado pelo React
            const fd = new FormData();

            fd.append("nome", formData.nome);
            fd.append("email", formData.email);
            fd.append("cnpj", formData.cnpj);
            fd.append("telefone", formData.telefone);
            fd.append("cep", formData.cep);
            fd.append("rua", formData.rua);
            fd.append("numero", formData.numero);
            fd.append("bairro", formData.bairro);
            fd.append("cidade", formData.cidade);
            fd.append("estado", formData.estado);
            fd.append("descricao", formData.descricao);
            fd.append("palavras_chave", JSON.stringify(tags));

            // Adiciona a imagem APENAS se o usuário tiver selecionado um novo arquivo
            const fileInput = document.getElementById("imageUpload");
            if (fileInput && fileInput.files.length > 0) {
                fd.append("arquivo", fileInput.files[0]);
            }

            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3001/api/perfil", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: fd
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.erro || "Erro ao atualizar perfil");
                return;
            }

            alert("Perfil atualizado com sucesso!");
        } catch (err) {
            console.error(err);
            alert("Erro ao conectar com servidor");
        }
    };

    const isLimitReached = tags.length >= 8;

    // Evita renderizar o form vazio enquanto carrega os dados
    if (loading) {
        return (
            <main className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4 align-items-center justify-content-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Carregando...</span>
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
                    {/* CABEÇALHO DA TELA */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3 border-bottom border-white-10 pb-4">
                        <div>
                            <h1 className="font-georgia fw-bold mb-1">Editar Meu Perfil</h1>
                            <p className="text-white-50 fs-6 mb-0">
                                As informações salvas refletem diretamente nos seus Matches de vagas.
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Link
                                href="/PerfilCandidato"
                                id="btn-cancelar"
                                className="btn btn-outline-light rounded-pill px-4"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                form="form-perfil"
                                className="btn btn-primeiro rounded-pill px-4 fw-bold shadow"
                            >
                                <i className="bi bi-check-circle me-2" />
                                Salvar Alterações
                            </button>
                        </div>
                    </div>

                    <form
                        id="form-perfil"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >
                        <div className="row g-4">
                            {/* COLUNA ESQUERDA: FOTO (30%) */}
                            <div className="col-xl-3 col-lg-4">
                                <div
                                    className="card border-0 rounded-4 shadow mb-4"
                                    style={{ backgroundColor: "var(--cor-fundo)" }}
                                >
                                    <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                                        <h4 className="fw-bold text-dark m-0">
                                            <i className="bi bi-building me-2 text-success" />
                                            Sobre a Empresa
                                        </h4>
                                    </div>

                                    <div className="card-body p-4">
                                        <textarea
                                            name="descricao"
                                            rows={6}
                                            className="form-control rounded-3"
                                            value={formData.descricao}
                                            onChange={handleChange}
                                            placeholder="Descreva sua empresa..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* COLUNA DIREITA: FORMULÁRIOS PRINCIPAIS (70%) */}
                            <div className="col-xl-9 col-lg-8">
                                {/* CARD 1: DADOS PESSOAIS */}
                                <div
                                    className="card border-0 rounded-4 shadow mb-4"
                                    style={{ backgroundColor: "var(--cor-fundo)" }}
                                >
                                    <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                                        <h4 className="fw-bold text-dark m-0">
                                            <i className="bi bi-card-heading me-2 text-success" />
                                            Informações Básicas
                                        </h4>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="row g-3">

                                            <div className="col-md-6">
                                                <label className="form-label">Nome da Empresa</label>
                                                <input
                                                    type="text"
                                                    name="nome"
                                                    className="form-control"
                                                    value={formData.nome}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">E-mail</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Telefone</label>
                                                <input
                                                    type="text"
                                                    name="telefone"
                                                    className="form-control"
                                                    value={formData.telefone}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">CEP</label>
                                                <input
                                                    type="text"
                                                    name="cep"
                                                    className="form-control"
                                                    value={formData.cep}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-8">
                                                <label className="form-label">Rua</label>
                                                <input
                                                    type="text"
                                                    name="rua"
                                                    className="form-control"
                                                    value={formData.rua}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Número</label>
                                                <input
                                                    type="text"
                                                    name="numero"
                                                    className="form-control"
                                                    value={formData.numero}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Bairro</label>
                                                <input
                                                    type="text"
                                                    name="bairro"
                                                    className="form-control"
                                                    value={formData.bairro}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Cidade</label>
                                                <input
                                                    type="text"
                                                    name="cidade"
                                                    className="form-control"
                                                    value={formData.cidade}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-2">
                                                <label className="form-label">UF</label>
                                                <input
                                                    type="text"
                                                    name="estado"
                                                    maxLength={2}
                                                    className="form-control"
                                                    value={formData.estado}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label">Descrição</label>
                                                <textarea
                                                    name="descricao"
                                                    rows={5}
                                                    className="form-control"
                                                    value={formData.descricao}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label">Logo da Empresa</label>
                                                <input
                                                    type="file"
                                                    id="imageUpload"
                                                    name="arquivo"
                                                    className="form-control"
                                                    accept=".png,.jpg,.jpeg"
                                                />
                                            </div>

                                            <div className="col-12 text-end">
                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                >
                                                    Salvar Alterações
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}