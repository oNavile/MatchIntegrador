"use client";
import React, { useState, useEffect, useRef } from 'react';

const KnowledgeBase = {
    saudacao: {
        keywords: [
            "oi", "oii", "oiii", "oiiii", "olá", "ola", "opa",
            "eae", "e ai", "e aí", "fala", "fala ai", "fala aí",
            "salve", "iae", "hey", "hello", "bom dia",
            "boa tarde", "boa noite", "tudo bem",
            "como vai", "como vc ta", "como você está"
        ],
        reply: "Olá! 😊 Sou o assistente da MatchHire. Posso ajudar com vagas, currículo, entrevistas, perfil, empresas, salários e carreira."
    },
    agradecimento: {
        keywords: [
            "obrigado", "obrigada", "valeu", "vlw",
            "tmj", "tamo junto", "brigado",
            "agradeço", "agradecido"
        ],
        reply: "Fico feliz em ajudar! 😊 Sempre que precisar, estarei por aqui."
    },
    despedida: {
        keywords: [
            "tchau", "adeus", "falou",
            "fui", "até mais", "até logo",
            "encerrar", "sair"
        ],
        reply: "Até mais! 🚀 Boa sorte na sua carreira."
    },
    quemSomos: {
        keywords: [
            "o que é a matchhire", "quem são vocês", "quem criou",
            "sobre a matchhire", "o que vocês fazem",
            "como funciona a empresa", "me fale da matchhire"
        ],
        reply: "A MatchHire é uma plataforma que conecta candidatos e empresas através de um sistema inteligente de compatibilidade profissional."
    },
    vagas: {
        keywords: [
            "vaga", "vagas", "emprego", "trabalho", "oportunidade",
            "quero trabalhar", "procurando emprego", "procurando vaga",
            "arrumar emprego", "achar emprego"
        ],
        reply: "Você pode acessar a área de vagas para encontrar oportunidades compatíveis com seu perfil."
    },
    curriculo: {
        keywords: [
            "curriculo", "currículo", "cv", "curriculum", "resume",
            "melhorar curriculo", "analisar curriculo", "editar curriculo"
        ],
        reply: "Um bom currículo deve destacar resultados, experiências e habilidades relevantes para a vaga desejada."
    },
    entrevista: {
        keywords: [
            "entrevista", "entrevistador", "entrevistas",
            "dicas entrevista", "como ir bem", "estou nervoso"
        ],
        reply: "Pesquise a empresa, revise a vaga e prepare exemplos reais das suas experiências profissionais."
    },
    linkedin: {
        keywords: [
            "linkedin", "perfil linkedin", "networking",
            "recrutadores", "conexões"
        ],
        reply: "Um LinkedIn atualizado aumenta suas chances de ser encontrado por recrutadores."
    },
    salario: {
        keywords: [
            "salario", "salário", "pretensão salarial",
            "quanto pedir", "quanto ganhar", "remuneração"
        ],
        reply: "Pesquise a média salarial da sua área antes de informar sua pretensão."
    },
    estagio: {
        keywords: [
            "estagio", "estágio", "jovem aprendiz",
            "primeiro emprego", "sem experiencia", "sem experiência"
        ],
        reply: "Mesmo sem experiência profissional, destaque cursos, projetos, idiomas e habilidades."
    },
    empresa: {
        keywords: [
            "empresa", "empresas", "contratar",
            "recrutar", "funciona para empresa"
        ],
        reply: "Empresas podem anunciar vagas, encontrar talentos e acompanhar processos seletivos pela MatchHire."
    },
    match: {
        keywords: [
            "match", "compatibilidade", "porcentagem",
            "algoritmo", "pontuação", "ranking"
        ],
        reply: "Nosso sistema calcula a compatibilidade entre suas habilidades e os requisitos das vagas."
    },
    perfil: {
        keywords: [
            "perfil", "conta", "meus dados",
            "editar perfil", "alterar perfil"
        ],
        reply: "Você pode atualizar suas informações acessando a área 'Seu Perfil'."
    },
    login: {
        keywords: [
            "login", "entrar", "acessar conta",
            "não consigo entrar", "nao consigo entrar", "erro login"
        ],
        reply: "Verifique seu e-mail e senha. Caso necessário, utilize a recuperação de senha."
    },
    senha: {
        keywords: [
            "senha", "esqueci senha", "recuperar senha", "trocar senha"
        ],
        reply: "Você pode redefinir sua senha utilizando a opção 'Esqueci minha senha'."
    },
    planos: {
        keywords: [
            "preço", "preco", "valor", "plano", "planos",
            "mensalidade", "gratuito", "gratis"
        ],
        reply: "A MatchHire é gratuita para candidatos. Alguns recursos empresariais podem possuir planos específicos."
    },
    curso: {
        keywords: [
            "curso", "cursos", "certificação", "certificado", "estudar"
        ],
        reply: "Cursos e certificações ajudam a fortalecer seu perfil profissional."
    },
    habilidades: {
        keywords: [
            "skill", "skills", "habilidade", "habilidades",
            "competência", "competencias"
        ],
        reply: "Adicionar habilidades relevantes aumenta significativamente seu Match com as vagas."
    },
    elogio: {
        keywords: [
            "legal", "bacana", "ótimo", "otimo",
            "excelente", "show", "perfeito", "muito bom"
        ],
        reply: "Muito obrigado! 😊 Estou aqui para ajudar."
    },
    estadoHumor: {
        keywords: [
            "estou triste", "to triste", "estou nervoso",
            "to nervoso", "ansioso", "com medo da entrevista"
        ],
        reply: "É normal sentir isso durante a busca por oportunidades. Prepare-se com antecedência e confie nas suas habilidades."
    },
    quemVoceE: {
        keywords: [
            "quem é você", "quem e voce", "quem é vc",
            "quem e vc", "você é humano", "voce e humano"
        ],
        reply: "Sou o assistente virtual da MatchHire, criado para ajudar candidatos e empresas."
    },
    padrao: {
        reply: "Não entendi muito bem sua pergunta. Posso ajudar com vagas, currículo, entrevistas, perfil, empresas, salários e carreira."
    }
};

export default function MatchHireBot() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatRef = useRef(null);

    const scrollToBottom = () => {
        if (chatRef.current) {
            chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessages([
                {
                    id: Date.now(),
                    text: "Olá! Sou o assistente inteligente da <strong>MatchHire</strong>. Como posso te ajudar hoje?",
                    isBot: true,
                    isHTML: true,
                    time: getCurrentTime()
                }
            ]);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const getCurrentTime = () => {
        return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
    };

    const getBotResponse = (userInput) => {
        const cleanInput = userInput.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        for (const category in KnowledgeBase) {
            if (KnowledgeBase[category].keywords) {
                const match = KnowledgeBase[category].keywords.some(keyword => cleanInput.includes(keyword));
                if (match) {
                    return KnowledgeBase[category].reply;
                }
            }
        }
        return KnowledgeBase.padrao.reply;
    };

    const handleSend = (textOverride) => {
        const text = (textOverride || inputValue).trim();
        if (!text || isTyping) return;

        setIsTyping(true);
        setInputValue("");

        const userMsg = { id: Date.now(), text, isBot: false, isHTML: false, time: getCurrentTime() };
        setMessages(prev => [...prev, userMsg]);

        setTimeout(() => {
            const botReply = getBotResponse(text);
            const botMsg = { id: Date.now() + 1, text: botReply, isBot: true, isHTML: true, time: getCurrentTime() };
            
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800);
    };

    return (
        <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4">
            <style>
                {`
                @keyframes blink { 
                    0%, 80%, 100% { opacity: 0.2; } 
                    40% { opacity: 1; } 
                }
                `}
            </style>

            <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
                <div className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1"
                    style={{ background: 'linear-gradient(45deg, #162417, #2a402c)', borderTopLeftRadius: '30px' }}>

                    <div className="text-center mb-4">
                        <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style={{ width: '90px', height: '90px', background: 'rgba(255,255,255,0.15)' }}>
                            <i className="bi bi-robot fs-1 text-white"></i>
                        </div>
                        <h2 className="fw-bold">Assistente MatchHire</h2>
                        <p className="text-white-50">Tire dúvidas sobre a plataforma e carreira</p>
                    </div>

                    <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                        <button className="btn btn-light rounded-pill sugestao-btn" onClick={() => handleSend("Como funciona o Match?")}>Como funciona o Match?</button>
                        <button className="btn btn-light rounded-pill sugestao-btn" onClick={() => handleSend("Dicas para currículo")}>Dicas para currículo</button>
                        <button className="btn btn-light rounded-pill sugestao-btn" onClick={() => handleSend("Preparação para entrevista")}>Preparação para entrevista</button>
                    </div>

                    <div className="row justify-content-center flex-grow-1">
                        <div className="col-lg-10">
                            <div className="card border-0 rounded-4 shadow-lg h-100" style={{ background: '#f8f9fa' }}>
                                
                                {/* Área do Chat */}
                                <div id="chat-messages" className="card-body p-4" style={{ height: '450px', overflowY: 'auto' }} ref={chatRef} aria-live="polite" role="log">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`d-flex ${msg.isBot ? "justify-content-start" : "justify-content-end"} mb-3 w-100`}>
                                            <div className={`p-3 rounded-4 position-relative ${msg.isBot ? "bg-white text-dark border shadow-sm" : "text-white shadow-sm"}`}
                                                style={{ 
                                                    maxWidth: '85%', 
                                                    wordBreak: 'break-word', 
                                                    fontSize: '0.95rem', 
                                                    lineHeight: '1.5', 
                                                    background: msg.isBot ? '' : 'linear-gradient(45deg, #162417, #2a402c)' 
                                                }}>
                                                
                                                <span>
                                                    {msg.isBot ? "🤖 " : ""}
                                                    {msg.isHTML ? <span dangerouslySetInnerHTML={{ __html: msg.text }} /> : msg.text}
                                                </span>

                                                <div className="text-end mt-1" style={{ fontSize: '0.7rem', opacity: 0.7, color: msg.isBot ? '#888' : '#d1dfd2' }}>
                                                    {msg.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Indicador de "Digitando" */}
                                    {isTyping && (
                                        <div id="typing-indicator-container" className="d-flex justify-content-start mb-3 w-100">
                                            <div className="p-3 rounded-4 bg-white border shadow-sm d-flex align-items-center gap-1" style={{ maxWidth: '85%', height: '50px' }}>
                                                <div style={{ width: '6px', height: '6px', background: '#888', borderRadius: '50%', animation: 'blink 1.4s infinite both' }}></div>
                                                <div style={{ width: '6px', height: '6px', background: '#888', borderRadius: '50%', animation: 'blink 1.4s infinite both', animationDelay: '0.2s' }}></div>
                                                <div style={{ width: '6px', height: '6px', background: '#888', borderRadius: '50%', animation: 'blink 1.4s infinite both', animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Rodapé com Input */}
                                <div className="card-footer bg-white border-0 p-3">
                                    <div className="input-group">
                                        <input 
                                            id="mensagemInput" 
                                            type="text" 
                                            className="form-control rounded-pill"
                                            placeholder="Digite sua dúvida..." 
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            disabled={isTyping}
                                        />
                                        <button 
                                            id="btnEnviar" 
                                            className="btn btn-success rounded-pill ms-2 px-4" 
                                            onClick={() => handleSend()}
                                            disabled={isTyping}
                                        >
                                            <i className="bi bi-send-fill"></i>
                                        </button>
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