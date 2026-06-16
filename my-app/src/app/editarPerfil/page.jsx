"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditarPerfil() {
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [nomeOriginal, setNomeOriginal] = useState("Seu Nome");

  // Estado para controlar os campos de texto do formulário
  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
    cidade: "", 
    modalidade: "Remoto",
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
          const cidadeFormatada = data.cidade && data.estado 
            ? `${data.cidade} - ${data.estado}` 
            : (data.cidade || "");

          setNomeOriginal(data.nome || "Seu Nome");

          setFormData({
            nome: data.nome || "",
            cargo: data.cargo || "", 
            email: data.email || "",
            telefone: data.telefone || "",
            cidade: cidadeFormatada,
            modalidade: data.modalidade || "Remoto",
            descricao: data.descricao || ""
          });

          if (data.palavras_chave) {
            setTags(data.palavras_chave);
          }

          if (data.arquivo) {
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
      .replace(/\D/g, '') 
      .replace(/(\d{2})(\d)/, '($1) $2') 
      .replace(/(\d{5})(\d{4})\d+?$/, '$1-$2'); 
  };

  // Handler para atualizar os campos de texto conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "telefone" ? phoneMask(value) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
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
      const fd = new FormData();
      
      fd.append("nome", formData.nome);
      fd.append("cargo", formData.cargo);
      fd.append("email", formData.email);
      fd.append("telefone", formData.telefone);
      fd.append("modalidade", formData.modalidade);
      fd.append("descricao", formData.descricao);
      fd.append("palavras_chave", JSON.stringify(tags));

      const inputCidade = formData.cidade || "";
      if (inputCidade.includes("-")) {
        const parts = inputCidade.split("-");
        fd.append("cidade", parts[0].trim());
        fd.append("estado", parts[1] ? parts[1].trim() : "");
      } else {
        fd.append("cidade", inputCidade.trim());
        fd.append("estado", ""); 
      }

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

      alert("Perfil updated com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com servidor");
    }
  };

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
            <div className="row g-4 justify-content-center">
              <div className="col-12 col-md-10 col-lg-8 col-xl-7 mx-auto">
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
                        <label className="form-label fw-semibold text-dark small">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          name="nome"
                          placeholder={formData.nome}
                          className="form-control rounded-3"
                          value={formData.nome}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Cargo Pretendido / Título
                        </label>
                        <input
                          type="text"
                          name="cargo"
                          className="form-control rounded-3"
                          value={formData.cargo}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          E-mail de Contato
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control rounded-3"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Telefone Celular
                        </label>
                        <input
                          type="text"
                          name="telefone"
                          className="form-control rounded-3"
                          id="phone-mask"
                          value={formData.telefone}
                          onChange={handleChange}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="col-md-8">
                        <label className="form-label fw-semibold text-dark small">
                          Cidade / Estado
                        </label>
                        <input
                          type="text"
                          name="cidade"
                          className="form-control rounded-3"
                          value={formData.cidade}
                          onChange={handleChange}
                          placeholder="Ex: São Paulo - SP (Use o hífen)"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-dark small">
                          Modalidade Preferida
                        </label>
                        <select 
                          className="form-select rounded-3" 
                          name="modalidade"
                          value={formData.modalidade}
                          onChange={handleChange}
                        >
                          <option value="Remoto">Remoto</option>
                          <option value="Híbrido">Híbrido</option>
                          <option value="Presencial">Presencial</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="card border-0 rounded-4 shadow mb-4"
                  style={{ backgroundColor: "var(--cor-fundo)" }}
                >
                  <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                    <h4 className="fw-bold text-dark m-0">
                      <i className="bi bi-person-lines-fill me-2 text-success" />
                      Resumo Profissional
                    </h4>
                  </div>
                  <div className="card-body p-4">
                    <textarea
                      name="descricao"
                      className="form-control rounded-3"
                      rows={4}
                      placeholder="Escreva uma breve introdução sobre sua carreira, conquistas e objetivos..."
                      value={formData.descricao}
                      onChange={handleChange}
                    />
                    <div className="form-text text-end small text-muted">
                      Dica: Perfis com resumos bem estruturados ganham 40% mais atenção de recrutadores.
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