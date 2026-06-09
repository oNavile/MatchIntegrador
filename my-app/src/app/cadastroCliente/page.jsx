"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastroCliente() {
    const router = useRouter();

    // Dados Pessoais
    const [emailCandidato, setEmailCandidato] = useState("");
    const [senhaCandidato, setSenhaCandidato] = useState("");
    const [nomeCandidato, setNomeCandidato] = useState("");
    const [cpfCandidato, setCpfCandidato] = useState("");
    const [dataNascimentoCandidato, setDataNascimentoCandidato] = useState("");
    const [telefoneCandidato, setTelefoneCandidato] = useState("");
    const [fotoPerfilCandidato, setFotoPerfilCandidato] = useState(null);
    const [curriculoCandidato, setCurriculoCandidato] = useState(null);
    const [descricaoCandidato, setDescricaoCandidato] = useState("");

    // Endereço
    const [cepCandidato, setCepCandidato] = useState("");
    const [ruaCandidato, setRuaCandidato] = useState("");
    const [numeroCandidato, setNumeroCandidato] = useState("");
    const [bairroCandidato, setBairroCandidato] = useState("");
    const [cidadeCandidato, setCidadeCandidato] = useState("");
    const [estadoCandidato, setEstadoCandidato] = useState("");

    // Palavras-chave
    const [palavrasChave, setPalavrasChave] = useState([]);
    const limiteMaximoKeywords = 8;

    const aplicarMascaraCPF = (valor) => {
        return valor
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const aplicarMascaraTelefone = (valor) => {
        return valor
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d{4})$/, '$1-$2');
    };

    const aplicarMascaraCEP = (valor) => {
        return valor
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2');
    };

    // --- REATIVIDADE DO CORPO (BODY) ---
    // Monitora a lista de palavras-chave e atualiza a classe do body automaticamente,
    // inclusive na inicialização (caso já venha preenchida do banco)
    useEffect(() => {
        if (palavrasChave.length >= limiteMaximoKeywords) {
            document.body.classList.add('limit-reached');
        } else {
            document.body.classList.remove('limit-reached');
        }

        // Limpeza opcional ao desmontar o componente
        return () => {
            document.body.classList.remove('limit-reached');
        };
    }, [palavrasChave]);

    // --- GERENCIAMENTO DE PALAVRAS CHAVE ---
    const handleCheckboxChange = (e) => {
        const valor = e.target.value;

        if (e.target.checked) {
            // Se tentar marcar além do limite, barra e avisa
            if (palavrasChave.length >= limiteMaximoKeywords) {
                e.target.checked = false;
                alert(`Você já escolheu o limite máximo de ${limiteMaximoKeywords} opções.`);
                return;
            }
            setPalavrasChave([...palavrasChave, valor]);
        } else {
            setPalavrasChave(palavrasChave.filter(item => item !== valor));
        }
    };

    // --- ENVIO DO FORMULÁRIO ---
    // --- ENVIO DO FORMULÁRIO (CORRIGIDO) ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("A senha que o formulário vai enviar é:", senhaCandidato);

        const formData = new FormData();

        // 1. CORREÇÃO DA IDADE: O backend espera um número inteiro chamado 'idade'.
        // Calculamos a idade com base na data de nascimento capturada no seu input.
        if (dataNascimentoCandidato) {
            const hoje = new Date();
            const nascimento = new Date(dataNascimentoCandidato);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const m = hoje.getMonth() - nascimento.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }
            formData.append('idade', idade); // Enviando o inteiro esperado pelo backend
        } 

        // Campos normais textuais
        formData.append('email', emailCandidato);
        formData.append('senha', senhaCandidato);
        formData.append('nome', nomeCandidato);
        formData.append('cpf', cpfCandidato);
        formData.append('dataNascimento', dataNascimentoCandidato);
        formData.append('telefone', telefoneCandidato);
        formData.append('descricao', descricaoCandidato);
        formData.append('cep', cepCandidato);
        formData.append('rua', ruaCandidato);
        formData.append('numero', numeroCandidato);
        formData.append('bairro', bairroCandidato);
        formData.append('cidade', cidadeCandidato);
        formData.append('estado', estadoCandidato);
        
        // ✨ AJUSTADO: Agora salva como "HTML5 / CSS3, JavaScript, React.js" pronto para o Match!
        formData.append('tags_perfil', palavrasChave.join(', '));

        // 3. ENVIO DOS ARQUIVOS (Garante que os nomes batem com as chaves do Multer)

        // 3. ENVIO DOS ARQUIVOS (Garante que os nomes batem com as chaves do Multer)
        if (fotoPerfilCandidato && fotoPerfilCandidato instanceof File) {
            formData.append('foto_perfil', fotoPerfilCandidato);
        } else {
            console.log("Foto de perfil não selecionada ou inválida");
        }

        if (curriculoCandidato && curriculoCandidato instanceof File) {
            formData.append('curriculo', curriculoCandidato);
        } else {
            console.log("Currículo não selecionado ou inválido");
        }

        try {
            const response = await fetch('http://localhost:3001/api/auth/cadastro/candidato', { // Ajuste sua URL
                method: 'POST',
                body: formData, // Sem Content-Type header aqui! O browser define o boundary automaticamente.
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

    return (
        <>
            {/* BLOCO DE CONTEÚDO 🚥 */}
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
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link active rounded-pill px-4 py-2 fs-5 btn-primeiro text-decoration-none" href="/cadastro">
                                                <i className="bi bi-building me-2" />
                                                Sou Empresa
                                            </a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link rounded-pill px-4 py-2 fs-5 btn-primeiro text-decoration-none" href="/cadastroCliente">
                                                <i className="bi bi-person-vcard me-2" />
                                                Sou Candidato
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="tab-pane fade show active" id="pills-empresa" role="tabpanel" aria-labelledby="pills-empresa-tab">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-9">
                                            <div className="p-4 p-md-5 text-dark-custom shadow-lg" style={{ backgroundColor: "#9DC5BB", borderRadius: 24 }}>
                                                <div className="text-center mb-5">
                                                    <h2 className="fw-bold font-georgia mb-2 text-dark">Cadastro Pessoal</h2>
                                                    <p className="text-muted">Preencha os seus dados para liberar o acesso à plataforma</p>
                                                </div>

                                                <form onSubmit={handleSubmit} id="form-cadastro-cliente">
                                                    <h5 className="section-title mt-0 mb-3 border-bottom pb-2 text-dark fw-bold">
                                                        <i className="bi bi-shield-lock me-2 text-success" />
                                                        1. Informações de Acesso
                                                    </h5>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label fw-medium text-dark">E-mail Pessoal:</label>
                                                            <input
                                                                type="email"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="maisa@gmail.com"
                                                                required
                                                                maxLength={180}
                                                                value={emailCandidato}
                                                                onChange={(e) => setEmailCandidato(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label fw-medium text-dark">Senha:</label>
                                                            <input
                                                                type="password"
                                                                placeholder="Digite sua senha"
                                                                className="form-control form-control-custom bg-white"
                                                                value={senhaCandidato} // <-- Tem que ser a mesma variável do formData
                                                                onChange={(e) => setSenhaCandidato(e.target.value)} // <-- Tem que atualizar o estado certo
                                                            />
                                                        </div>
                                                    </div>

                                                    <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                                                        <i className="bi bi-person me-2 text-success" />
                                                        2. Dados Pessoais
                                                    </h5>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label fw-medium text-dark">Nome Completo:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="Digite seu nome completo"
                                                                required
                                                                maxLength={150}
                                                                value={nomeCandidato}
                                                                onChange={(e) => setNomeCandidato(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label fw-medium text-dark">CPF:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="000.000.000-00"
                                                                maxLength={14}
                                                                required
                                                                value={cpfCandidato}
                                                                onChange={(e) => setCpfCandidato(aplicarMascaraCPF(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label fw-medium text-dark">Data de Nascimento:</label>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-custom bg-white"
                                                                required
                                                                value={dataNascimentoCandidato}
                                                                onChange={(e) => setDataNascimentoCandidato(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-3 w-50">
                                                            <label className="form-label fw-medium text-dark">Telefone / WhatsApp:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="(00) 00000-0000"
                                                                maxLength={15}
                                                                required
                                                                value={telefoneCandidato}
                                                                onChange={(e) => setTelefoneCandidato(aplicarMascaraTelefone(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label fw-medium text-dark">Foto para Perfil:</label>
                                                            <input
                                                                type="file"
                                                                className="form-control form-control-custom bg-white"
                                                                accept="image/*"
                                                                onChange={(e) => setFotoPerfilCandidato(e.target.files[0])}
                                                            />
                                                        </div>
                                                        <div className="col-md-6 w-100">
                                                            <label className="form-label fw-medium text-dark">Currículo (PDF):</label>
                                                            <input
                                                                type="file"
                                                                className="form-control form-control-custom bg-white"
                                                                accept=".pdf"
                                                                onChange={(e) => setCurriculoCandidato(e.target.files[0])}
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="form-label fw-medium text-dark">Descrição / Quem Sou:</label>
                                                            <textarea
                                                                className="form-control form-control-custom bg-white"
                                                                rows={4}
                                                                placeholder="Conte um pouco sobre sua trajetória profissional, principais habilidades e objetivos..."
                                                                value={descricaoCandidato}
                                                                onChange={(e) => setDescricaoCandidato(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                                                        <i className="bi bi-geo-alt me-2 text-success" />
                                                        3. Endereço de Residência:
                                                    </h5>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-3">
                                                            <label className="form-label fw-medium text-dark">CEP:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="00000-000"
                                                                maxLength={9}
                                                                required
                                                                value={cepCandidato}
                                                                onChange={(e) => setCepCandidato(aplicarMascaraCEP(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label fw-medium text-dark">Rua:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="Ex: Av. Paulista"
                                                                required
                                                                value={ruaCandidato}
                                                                onChange={(e) => setRuaCandidato(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label fw-medium text-dark">Número:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="123"
                                                                required
                                                                value={numeroCandidato}
                                                                onChange={(e) => setNumeroCandidato(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-5">
                                                            <label className="form-label fw-medium text-dark">Bairro:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="Bairro"
                                                                required
                                                                value={bairroCandidato}
                                                                onChange={(e) => setBairroCandidato(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-5">
                                                            <label className="form-label fw-medium text-dark">Cidade:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="Cidade"
                                                                required
                                                                value={cidadeCandidato}
                                                                onChange={(e) => setCidadeCandidato(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label fw-medium text-dark">Estado (UF):</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-custom bg-white"
                                                                placeholder="UF"
                                                                maxLength={2}
                                                                required
                                                                value={estadoCandidato}
                                                                onChange={(e) => setEstadoCandidato(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                                                        <i className="bi bi-geo-alt me-2 text-success" />
                                                        4. Selecione Palavras chave para um Match automático.
                                                    </h5>
                                                    <p className="text-dark">Selecione no máximo 8 opções.</p>

                                                    {/* 💻 TECNOLOGIA E PROGRAMAÇÃO (Subiu para destaque, mais relevante para o Match) */}
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
                                                            ].map(kw => (
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

                                                    {/* 📊 FERRAMENTAS E PRODUTIVIDADE (Limpado e focado) */}
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
                                                            ].map(kw => (
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

                                                    {/* 🗣️ IDIOMAS (Simplificado para o que as vagas realmente pedem) */}
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
                                                            ].map(kw => (
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
                                                    <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', cursor: 'pointer' }}>
                                                        Concluir Cadastro
                                                    </button>
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
        </>
    );
}