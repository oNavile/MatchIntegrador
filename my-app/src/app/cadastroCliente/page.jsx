"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Constantes de Keywords extraídas para limpar o JSX
const KEYWORDS_TECH = [
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
];

const KEYWORDS_TOOLS = [
    { id: "kw_office", val: "pacote office", label: "Microsoft Office (Word/PPT)" },
    { id: "kw_excel", val: "excel", label: "Excel Avançado / Dashboards" },
    { id: "kw_gsuite", val: "google workspace", label: "Google Workspace" },
    { id: "kw_pbi", val: "power bi", label: "Power BI / Analytics" },
    { id: "kw_agil", val: "metodologias ageis", label: "Gestão Ágil (Jira/Trello)" },
    { id: "kw_notion", val: "notion", label: "Notion" },
    { id: "kw_slack", val: "slack", label: "Comunicação (Slack/Teams)" }
];

const KEYWORDS_LANG = [
    { id: "kw_eng_i", val: "inglês intermediário", label: "Inglês Intermediário" },
    { id: "kw_eng_f", val: "inglês fluente", label: "Inglês Fluente / Avançado" },
    { id: "kw_esp_i", val: "espanhol intermediário", label: "Espanhol Intermediário" },
    { id: "kw_esp_f", val: "espanhol fluente", label: "Espanhol Fluente" },
    { id: "kw_libras", val: "libras", label: "Libras" }
];

export default function CadastroCliente() {
    const router = useRouter();
    const LIMITE_MAX_KEYWORDS = 8;

    // Estado centralizado para os campos de texto/dados
    const [formValues, setFormValues] = useState({
        email: "", senha: "", nome: "", cpf: "", dataNascimento: "",
        telefone: "", descricao: "", cep: "", rua: "", numero: "",
        bairro: "", cidade: "", estado: ""
    });

    // Estados separados apenas para arquivos e listas dinâmicas
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [curriculo, setCurriculo] = useState(null);
    const [palavrasChave, setPalavrasChave] = useState([]);

    // Máscaras de Input
    const aplicarMascaraCPF = (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    const aplicarMascaraTelefone = (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2');
    const aplicarMascaraCEP = (v) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');

    // Manipulador genérico para inputs de texto
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let valorFormatado = value;

        if (name === 'cpf') valorFormatado = aplicarMascaraCPF(value);
        if (name === 'telefone') valorFormatado = aplicarMascaraTelefone(value);
        if (name === 'cep') valorFormatado = aplicarMascaraCEP(value);

        setFormValues(prev => ({ ...prev, [name]: valorFormatado }));
    };

    useEffect(() => {
        const isLimitReached = palavrasChave.length >= LIMITE_MAX_KEYWORDS;
        document.body.classList.toggle('limit-reached', isLimitReached);
        return () => document.body.classList.remove('limit-reached');
    }, [palavrasChave]);

    const handleCheckboxChange = (e) => {
        const valor = e.target.value;

        if (e.target.checked) {
            if (palavrasChave.length >= LIMITE_MAX_KEYWORDS) {
                e.target.checked = false;
                alert(`Você já escolheu o limite máximo de ${LIMITE_MAX_KEYWORDS} opções.`);
                return;
            }
            setPalavrasChave([...palavrasChave, valor]);
        } else {
            setPalavrasChave(palavrasChave.filter(item => item !== valor));
        }
    };

    const calcularIdade = (dataNasc) => {
        if (!dataNasc) return null;
        const hoje = new Date();
        const nascimento = new Date(dataNasc);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        
        // Append dos dados de texto
        Object.entries(formValues).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        // Append da idade calculada
        const idade = calcularIdade(formValues.dataNascimento);
        if (idade !== null) formDataToSend.append('idade', idade);

        // Tags e Arquivos
        formDataToSend.append('tags_perfil', palavrasChave.join(', '));
        if (fotoPerfil instanceof File) formDataToSend.append('foto_perfil', fotoPerfil);
        if (curriculo instanceof File) formDataToSend.append('curriculo', curriculo);

        try {
            const response = await fetch('http://localhost:3001/api/auth/cadastro/candidato', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                alert('Cadastro concluído com sucesso!');
                router.push('/login');
            } else {
                alert('Erro ao realizar cadastro.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    // Renderizador helper para os grupos de checkbox
    const renderKeywordGroup = (title, icon, items) => (
        <div className="mb-4">
            <h6 className="fw-bold text-secondary mb-2">
                <i className={`bi ${icon} me-1`} /> {title}
            </h6>
            <div className="d-flex flex-wrap gap-2">
                {items.map(kw => (
                    <div className="keyword-chip" key={kw.id}>
                        <input
                            type="checkbox"
                            id={kw.id}
                            value={kw.val}
                            onChange={handleCheckboxChange}
                            checked={palavrasChave.includes(kw.val)}
                        />
                        <label htmlFor={kw.id}>{kw.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4">
            <div className="container-fluid pt-3 pb-5 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
                <div
                    className="p-4 p-md-5 shadow-lg text-white bg-dark-custom d-flex flex-column flex-grow-1"
                    style={{
                        backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
                        borderRadius: 0,
                        borderTopLeftRadius: 30
                    }}
                >
                    <div className="row align-items-center g-5 mb-5">
                        <div className="tab-content" id="pills-tabContent">
                            <div className="d-flex justify-content-center mb-5">
                                <ul className="nav nav-pills gap-3 custom-tabs" id="pills-tab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active rounded-pill px-4 py-2 fs-5 btn-primeiro text-decoration-none" href="/cadastro">
                                            <i className="bi bi-building me-2" /> Sou Empresa
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link rounded-pill px-4 py-2 fs-5 btn-terceiro text-decoration-none" href="/cadastroCliente">
                                            <i className="bi bi-person-vcard me-2" /> Sou Candidato
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="tab-pane fade show active" role="tabpanel">
                                <div className="row justify-content-center">
                                    <div className="col-lg-9">
                                        <div className="p-4 p-md-5 text-dark-custom shadow-lg" style={{ backgroundColor: "#9DC5BB", borderRadius: 24 }}>
                                            <div className="text-center mb-5">
                                                <h2 className="fw-bold font-georgia mb-2 text-dark">Cadastro Pessoal</h2>
                                                <p className="text-muted">Preencha os seus dados para liberar o acesso à plataforma</p>
                                            </div>

                                            <form onSubmit={handleSubmit} id="form-cadastro-cliente">
                                                <h5 className="section-title mt-0 mb-3 border-bottom pb-2 text-dark fw-bold">
                                                    <i className="bi bi-shield-lock me-2 text-success" /> 1. Informações de Acesso
                                                </h5>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium text-dark">E-mail Pessoal:</label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="maisa@gmail.com"
                                                            required
                                                            maxLength={180}
                                                            value={formValues.email}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium text-dark">Senha:</label>
                                                        <input
                                                            type="password"
                                                            name="senha"
                                                            placeholder="Digite sua senha"
                                                            className="form-control form-control-custom bg-white"
                                                            required
                                                            value={formValues.senha}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                                                    <i className="bi bi-person me-2 text-success" /> 2. Dados Pessoais
                                                </h5>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium text-dark">Nome Completo:</label>
                                                        <input
                                                            type="text"
                                                            name="nome"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="Digite seu nome completo"
                                                            required
                                                            maxLength={150}
                                                            value={formValues.nome}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label fw-medium text-dark">CPF:</label>
                                                        <input
                                                            type="text"
                                                            name="cpf"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="000.000.000-00"
                                                            maxLength={14}
                                                            required
                                                            value={formValues.cpf}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label fw-medium text-dark">Data de Nascimento:</label>
                                                        <input
                                                            type="date"
                                                            name="dataNascimento"
                                                            className="form-control form-control-custom bg-white"
                                                            required
                                                            value={formValues.dataNascimento}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium text-dark">Telefone / WhatsApp:</label>
                                                        <input
                                                            type="text"
                                                            name="telefone"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="(00) 00000-0000"
                                                            maxLength={15}
                                                            required
                                                            value={formValues.telefone}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium text-dark">Currículo (PDF):</label>
                                                        <input
                                                            type="file"
                                                            className="form-control form-control-custom bg-white"
                                                            accept=".pdf"
                                                            onChange={(e) => setCurriculo(e.target.files[0])}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label className="form-label fw-medium text-dark">Descrição / Quem Sou:</label>
                                                        <textarea
                                                            name="descricao"
                                                            className="form-control form-control-custom bg-white"
                                                            rows={4}
                                                            placeholder="Conte um pouco sobre sua trajetória profissional..."
                                                            value={formValues.descricao}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                                                    <i className="bi bi-geo-alt me-2 text-success" /> 3. Endereço de Residência
                                                </h5>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-3">
                                                        <label className="form-label fw-medium text-dark">CEP:</label>
                                                        <input
                                                            type="text"
                                                            name="cep"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="00000-000"
                                                            maxLength={9}
                                                            required
                                                            value={formValues.cep}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium text-dark">Rua:</label>
                                                        <input
                                                            type="text"
                                                            name="rua"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="Ex: Av. Paulista"
                                                            required
                                                            value={formValues.rua}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label fw-medium text-dark">Número:</label>
                                                        <input
                                                            type="text"
                                                            name="numero"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="123"
                                                            required
                                                            value={formValues.numero}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-5">
                                                        <label className="form-label fw-medium text-dark">Bairro:</label>
                                                        <input
                                                            type="text"
                                                            name="bairro"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="Bairro"
                                                            required
                                                            value={formValues.bairro}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-5">
                                                        <label className="form-label fw-medium text-dark">Cidade:</label>
                                                        <input
                                                            type="text"
                                                            name="cidade"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="Cidade"
                                                            required
                                                            value={formValues.cidade}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label fw-medium text-dark">Estado (UF):</label>
                                                        <input
                                                            type="text"
                                                            name="estado"
                                                            className="form-control form-control-custom bg-white"
                                                            placeholder="UF"
                                                            maxLength={2}
                                                            required
                                                            value={formValues.estado}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                                                    <i className="bi bi-check2-circle me-2 text-success" /> 4. Selecione Palavras-chave para Match Automático
                                                </h5>
                                                <p className="text-dark">Selecione no máximo {LIMITE_MAX_KEYWORDS} opções.</p>

                                                {renderKeywordGroup("Tecnologia e Programação", "bi-code-slash", KEYWORDS_TECH)}
                                                {renderKeywordGroup("Ferramentas e Produtividade", "bi-pc-display", KEYWORDS_TOOLS)}
                                                {renderKeywordGroup("Idiomas", "bi-translate", KEYWORDS_LANG)}
                                                <div className="text-center mt-5">
                                                    <button type="submit" className="btn btn-success btn-lg px-5 rounded-pill shadow">
                                                        Concluir Cadastro
                                                    </button>
                                                </div>

                                            </form>
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