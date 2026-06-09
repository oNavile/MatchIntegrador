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
          // O backend retorna cidade e estado separados, mas o front exibe junto (Ex: São Paulo - SP)
          const cidadeFormatada = data.cidade && data.estado 
            ? `${data.cidade} - ${data.estado}` 
            : (data.cidade || "");

          setNomeOriginal(data.nome || "Seu Nome");

          setFormData({
            nome: data.nome || "",
            cargo: data.cargo || "", // Caso passe a existir no banco no futuro
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
      fd.append("cargo", formData.cargo);
      fd.append("email", formData.email);
      fd.append("telefone", formData.telefone);
      fd.append("modalidade", formData.modalidade);
      fd.append("descricao", formData.descricao);
      fd.append("palavras_chave", JSON.stringify(tags));

      // Tratamento mais seguro para Cidade/Estado
      const inputCidade = formData.cidade || "";
      if (inputCidade.includes("-")) {
        const parts = inputCidade.split("-");
        fd.append("cidade", parts[0].trim());
        fd.append("estado", parts[1] ? parts[1].trim() : "");
      } else {
        fd.append("cidade", inputCidade.trim());
        fd.append("estado", ""); // Garante que o estado não vá como undefined
      }

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
                  className="card border-0 rounded-4 shadow mb-4 text-center py-4 px-3"
                  style={{ backgroundColor: "var(--cor-fundo)" }}
                >
                  <div className="card-body p-2">
                    <div className="avatar-upload mb-3">
                      <div className="avatar-edit">
                        <label
                          htmlFor="imageUpload"
                          className="btn btn-primeiro rounded-circle shadow p-0 d-flex align-items-center justify-content-center"
                          style={{ width: 38, height: 38, cursor: "pointer" }}
                        >
                          <i className="bi bi-camera-fill text-white" />
                        </label>
                        <input
                          type="file"
                          name="arquivo"
                          id="imageUpload"
                          accept=".png, .jpg, .jpeg"
                          className="d-none"
                          onChange={handleImageChange}
                        />
                      </div>
                      <div className="avatar-preview">
                        <div 
                          id="imagePreview"
                          style={{
                            backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {!imagePreview && (
                            <i
                              id="avatar-icon-placeholder"
                              className="bi bi-person-fill fs-1 text-secondary"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <h5 className="fw-bold text-dark mb-1">{nomeOriginal}</h5>
                    <p className="text-muted small mb-4">
                      Formatos aceitos: JPG, PNG
                    </p>
                    <hr className="text-muted my-3" />
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

                {/* CARD 2: SOBRE MIM */}
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

                {/* CARD 3: COMPETÊNCIAS DINÂMICAS */}
                <div
                  className="card border-0 rounded-4 shadow mb-5"
                  style={{ backgroundColor: "var(--cor-fundo)" }}
                >
                  <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                    <h4 className="fw-bold text-dark m-0">
                      <i className="bi bi-stars me-2 text-success" />
                      Competências Técnicas (Hard Skills)
                    </h4>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label text-muted small mb-0">
                        Pressione <kbd>Enter</kbd> ou adicione uma vírgula para inserir uma competência:
                      </label>
                      <span
                        id="skills-counter"
                        className={isLimitReached ? "badge bg-danger text-white fw-bold fs-6" : "badge text-dark bg-light border fw-bold fs-6"}
                      >
                        {tags.length} / 8
                      </span>
                    </div>
                    <div className="input-group mb-2">
                      <span className="input-group-text bg-light text-muted">
                        <i className="bi bi-plus-lg" />
                      </span>
                      <input
                        type="text"
                        id="skill-input"
                        className="form-control rounded-end-3"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLimitReached}
                        placeholder={isLimitReached ? "Limite de 8 atingido!" : "Ex: TypeScript, Vue, Tailwind..."}
                      />
                    </div>
                    
                    <div
                      id="skills-feedback"
                      className={`text-danger small fw-semibold mb-3 ${isLimitReached ? '' : 'd-none'}`}
                    >
                      <i className="bi bi-exclamation-circle-fill me-1" /> Você atingiu o limite máximo de 8 competências. Remova alguma para adicionar novas.
                    </div>

                    <div
                      id="skills-wrapper"
                      className="d-flex flex-wrap gap-2 pt-2"
                    >
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="badge bg-success d-flex align-items-center gap-2 p-2 fs-6 rounded-3 shadow-sm"
                          style={{ backgroundColor: '#2a402c', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          {tag} 
                          <i 
                            className="bi bi-x-circle-fill tag-remove" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeTag(index)}
                          />
                        </span>
                      ))}
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