"use client"

import { useEffect, useState } from 'react';

export default function CadastroVagaEmpresa() {
  const [palavrasChave, setPalavrasChave] = useState([]);

  const limiteAtingido = palavrasChave.length >= 8;

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      if (limiteAtingido) {
        alert("Você pode selecionar no máximo 8 palavras-chave.");
        e.preventDefault();
        e.target.checked = false;
        return;
      }
      setPalavrasChave([...palavrasChave, value]);
    } else {
      setPalavrasChave(palavrasChave.filter((kw) => kw !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("1. Clicou no botão! O estado das palavrasChave tem:", palavrasChave);

    const formData = new FormData(e.target);
    const dadosVaga = Object.fromEntries(formData.entries());

    if (dadosVaga.salario) {
      dadosVaga.salario = dadosVaga.salario.replace(/\./g, '').replace(',', '.');
    }

    dadosVaga.palavras_chave = palavrasChave;

    try {
      const token = localStorage.getItem('token') || '';
      console.log("2. Enviando requisição com o Token:", token);

      const response = await fetch('http://localhost:3001/api/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosVaga),
      });

      console.log("3. Status da resposta do servidor:", response.status);

      const data = await response.json();
      console.log("4. Dados retornados pela API:", data);

      if (response.ok) {
        alert('Vaga publicada com sucesso!');
        e.target.reset();
        setPalavrasChave([]);
      } else {
        alert('Erro retornado pela API: ' + (data.erro || JSON.stringify(data)));
      }
    } catch (error) {
      console.error('5. Erro crítico na conexão com a API:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  useEffect(() => {
    const inputSalario = document.getElementById('salario');

    const mascararSalario = function (e) {
      let value = e.target.value.replace(/\D/g, '');
      if (!value) {
        e.target.value = '';
        return;
      }
      value = (value / 100).toFixed(2) + '';
      value = value.replace(".", ",");
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      e.target.value = value === "0,00" ? "" : value;
    };

    inputSalario?.addEventListener('input', mascararSalario);
    return () => inputSalario?.removeEventListener('input', mascararSalario);
  }, []);

  return (
    <>
      <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4 mb-0 pb-0">
        <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1 mb-0">
          <div
            className="p-4 p-md-5 shadow-lg text-white bg-dark-custom d-flex flex-column flex-grow-1 align-items-center justify-content-center mb-0"
            style={{
              backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
              borderRadius: 0,
              borderTopLeftRadius: 30
            }}
          >
            <div className="col-lg-9 col-xl-8 w-100 mb-5">
              <div
                className="p-4 p-md-5 text-dark-custom shadow-lg w-100"
                style={{ backgroundColor: "#9DC5BB", borderRadius: 24 }}
              >
                <div className="text-center mb-5">
                  <h2 className="fw-bold font-georgia mb-2 text-dark">
                    Publicar Nova Vaga
                  </h2>
                  <p className="text-muted">
                    Preencha os detalhes abaixo para anunciar uma oportunidade da sua empresa.
                  </p>
                </div>

                <form onSubmit={handleSubmit} id="form-cadastro-vaga">
                  <h5 className="section-title mt-0 mb-3 border-bottom pb-2 text-dark fw-bold">
                    <i className="bi bi-info-circle me-2 text-success" />
                    1. Informações Principais
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-12">
                      <label className="form-label fw-medium text-dark">Título da Vaga *</label>
                      <input
                        type="text"
                        name="titulo"
                        className="form-control form-control-custom bg-white"
                        placeholder="Ex: Desenvolvedor Front-end Sênior"
                        required
                        maxLength={150}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium text-dark">Cargo Relacionado</label>
                      <input
                        type="text"
                        name="cargo"
                        className="form-control form-control-custom bg-white"
                        placeholder="Ex: Desenvolvedor / Analista"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium text-dark">Setor</label>
                      <input
                        type="text"
                        name="setor"
                        className="form-control form-control-custom bg-white"
                        placeholder="Ex: Tecnologia da Informação"
                      />
                    </div>
                  </div>
                  <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                    <i className="bi bi-geo-alt me-2 text-success" />
                    2. Condições de Trabalho
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="form-label fw-medium text-dark">Modalidade *</label>
                      <select name="tipo" className="form-select form-control-custom bg-white" defaultValue="presencial" required>
                        <option value="presencial">Presencial</option>
                        <option value="hibrido">Híbrido</option>
                        <option value="remoto">Remoto</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-medium text-dark">Localização</label>
                      <input
                        type="text"
                        name="local"
                        className="form-control form-control-custom bg-white"
                        placeholder="Ex: São Paulo, SP (ou Remoto)"
                        maxLength={200}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-medium text-dark">Salário (R$)</label>
                      <input
                        type="text"
                        name="salario"
                        id="salario"
                        className="form-control form-control-custom bg-white"
                        placeholder="Ex: 5.000,00"
                      />
                      <div className="form-text text-dark opacity-75">Deixe em branco para "A combinar".</div>
                    </div>
                  </div>
                  <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                    <i className="bi bi-card-text me-2 text-success" />
                    3. Descrição e Requisitos
                  </h5>
                  <div className="row g-3 mb-5">
                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Descrição da Vaga</label>
                      <textarea
                        name="descricao"
                        className="form-control form-control-custom bg-white"
                        rows={4}
                        placeholder="Descreva as responsabilidades, o dia a dia da vaga e os benefícios..."
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Requisitos e Qualificações</label>
                      <textarea
                        name="requisitos"
                        className="form-control form-control-custom bg-white"
                        rows={3}
                        placeholder="Liste as habilidades técnicas e comportamentais necessárias..."
                      />
                    </div>
                  </div>
                  <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                    <i className="bi bi-geo-alt me-2 text-success" />
                    4. Selecione Palavras chave para um Match automático.
                  </h5>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <p className="text-dark mb-0">Selecione no máximo 8 opções.</p>
                    <span className="badge bg-secondary">{palavrasChave.length} / 8 selecionadas</span>
                  </div>
                  <div className="mb-4">
                    <h6 className="fw-bold text-secondary mb-2">
                      <i className="bi bi-code-slash me-1" /> Tecnologia e Programação
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {[
                        { id: "kw_html_css", val: "html", label: "HTML5 / CSS3" },
                        { id: "kw_js", val: "javaScript", label: "JavaScript / TypeScript" },
                        { id: "kw_react", val: "react.js", label: "React.js / Next.js" },
                        { id: "kw_node", val: "node.js", label: "Node.js" },
                        { id: "kw_py", val: "python", label: "Python" },
                        { id: "kw_java", val: "java", label: "Java" },
                        { id: "kw_csharp", val: "C# / .NET", label: "C# / .NET" },
                        { id: "kw_php", val: "php", label: "PHP / Laravel" },
                        { id: "kw_sql", val: "sql", label: "Bancos de Dados (SQL/NoSQL)" },
                        { id: "kw_git", val: "git", label: "Git / GitHub" }
                      ].map(kw => {
                        const estaSelecionado = palavrasChave.includes(kw.val);
                        const estiloDesabilitado = limiteAtingido && !estaSelecionado ? { opacity: 0.4, filter: 'grayscale(100%)', cursor: 'not-allowed' } : {};

                        return (
                          <div className="keyword-chip" key={kw.id} style={estiloDesabilitado}>
                            <input
                              type="checkbox"
                              id={kw.id}
                              value={kw.val}
                              onChange={handleCheckboxChange}
                              checked={estaSelecionado}
                            />
                            <label htmlFor={kw.id}>{kw.label}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h6 className="fw-bold text-secondary mb-2">
                      <i className="bi bi-pc-display me-1" /> Ferramentas e Produtividade
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {[
                        { id: "kw_office", val: "pacote office", label: "Microsoft Office (Word/PPT)" },
                        { id: "kw_excel", val: "excel", label: "Excel Avançado / Dashboards" },
                        { id: "kw_gsuite", val: "google workspace", label: "Google Workspace" },
                        { id: "kw_pbi", val: "power bi", label: "Power BI / Analytics" },
                        { id: "kw_agil", val: "metodologias ageis", label: "Gestão Ágil (Jira/Trello)" },
                        { id: "kw_notion", val: "notion", label: "Notion" },
                        { id: "kw_slack", val: "slack", label: "Comunicação (Slack/Teams)" }
                      ].map(kw => {
                        const estaSelecionado = palavrasChave.includes(kw.val);
                        const estiloDesabilitado = limiteAtingido && !estaSelecionado ? { opacity: 0.4, filter: 'grayscale(100%)', cursor: 'not-allowed' } : {};

                        return (
                          <div className="keyword-chip" key={kw.id} style={estiloDesabilitado}>
                            <input
                              type="checkbox"
                              id={kw.id}
                              value={kw.val}
                              onChange={handleCheckboxChange}
                              checked={estaSelecionado}
                            />
                            <label htmlFor={kw.id}>{kw.label}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h6 className="fw-bold text-secondary mb-2">
                      <i className="bi bi-translate me-1" /> Idiomas
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {[
                        { id: "kw_eng_i", val: "inglês intermediário", label: "Inglês Intermediário" },
                        { id: "kw_eng_f", val: "inglês fluente", label: "Inglês Fluente / Avançado" },
                        { id: "kw_esp_i", val: "espanhol intermediário", label: "Espanhol Intermediário" },
                        { id: "kw_esp_f", val: "espanhol fluente", label: "Espanhol Fluente" },
                        { id: "kw_libras", val: "libras", label: "Libras" }
                      ].map(kw => {
                        const estaSelecionado = palavrasChave.includes(kw.val);
                        const estiloDesabilitado = limiteAtingido && !estaSelecionado ? { opacity: 0.4, filter: 'grayscale(100%)', cursor: 'not-allowed' } : {};

                        return (
                          <div className="keyword-chip" key={kw.id} style={estiloDesabilitado}>
                            <input
                              type="checkbox"
                              id={kw.id}
                              value={kw.val}
                              onChange={handleCheckboxChange}
                              checked={estaSelecionado}
                            />
                            <label htmlFor={kw.id}>{kw.label}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-end border-top pt-4">
                    <button type="submit" className="btn btn-primeiro w-100 rounded-pill py-3 fw-bold shadow transition-all d-flex align-items-center justify-content-center gap-2">
                                     Criar vaga
                                  </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}