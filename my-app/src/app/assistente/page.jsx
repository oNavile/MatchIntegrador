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
    maldades: {
    keywords: [
        "ruim",
        "não ajudou",
        "nao ajudou",
        "péssimo",
        "pessimo",
        "horrível",
        "horrivel",
        "não gostei",
        "nao gostei",
        "inútil",
        "inutil",
        "lixo"
    ],
    reply: "Sinto muito por não ter atendido sua expectativa. 😔 Tente reformular sua pergunta ou fornecer mais informações para que eu possa ajudar melhor."
},
cursos: {
    keywords: [
        "curso",
        "cursos",
        "aprender",
        "capacitação",
        "capacitacao",
        "treinamento"
    ],
    reply: "📚 Nossa plataforma oferece diversos cursos para candidatos e empresas. Você pode aprender sobre entrevistas de emprego, elaboração de currículo, comunicação profissional, liderança, inclusão no ambiente de trabalho e muito mais!"
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
<main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4 mb-0 pb-0">
  <style>
    {`
      @keyframes blink { 
        0%, 80%, 100% { opacity: 0.2; } 
        40% { opacity: 1; } 
      }
    `}
  </style>

  <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1 mb-0">
    <div
      className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1 mb-0"
      style={{
        backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      }}
    >
      <div className="col-lg-12 w-100 mb-5 px-0 px-md-3">
        <div
          className="p-4 p-md-5 text-dark shadow-lg w-100"
          style={{ backgroundColor: "#9DC5BB", borderRadius: 24 }}
        >
          <div className="text-center mb-4 border-bottom border-dark border-opacity-10 pb-4">
            <div
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "80px", height: "80px", background: "linear-gradient(45deg, #162417 0%, #2a402c 100%)" }}
            >
              <i className="bi bi-robot fs-2 text-success"></i>
            </div>
            <h2 className="fw-bold font-georgia text-dark mb-1">Assistente MatchHire</h2>
            <p className="text-muted small mb-0">Tire suas dúvidas sobre a plataforma, processos seletivos e carreira em tempo real</p>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            <button className="btn btn-sm btn-dark bg-opacity-75 rounded-pill px-3 py-2 fw-medium shadow-sm transition-card" onClick={() => handleSend("Como funciona o Match?")}>
              <i className="bi bi-lightning-charge me-1 text-success" /> Como funciona o Match?
            </button>
            <button className="btn btn-sm btn-dark bg-opacity-75 rounded-pill px-3 py-2 fw-medium shadow-sm transition-card" onClick={() => handleSend("Dicas para currículo")}>
              <i className="bi bi-file-earmark-person me-1 text-success" /> Dicas para currículo
            </button>
            <button className="btn btn-sm btn-dark bg-opacity-75 rounded-pill px-3 py-2 fw-medium shadow-sm transition-card" onClick={() => handleSend("Preparação para entrevista")}>
              <i className="bi bi-chat-square-quote me-1 text-success" /> Preparação para entrevista
            </button>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-10 col-12">
              <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
                <div 
                  id="chat-messages" 
                  className="card-body p-4 bg-light bg-opacity-50" 
                  style={{ height: "420px", overflowY: "auto" }} 
                  ref={chatRef} 
                  aria-live="polite" 
                  role="log"
                >
                  {messages.map((msg) => (
                    <div key={msg.id} className={`d-flex ${msg.isBot ? "justify-content-start" : "justify-content-end"} mb-3 w-100`}>
                      <div 
                        className={`p-3 rounded-4 shadow-sm ${msg.isBot ? "text-dark border-0" : "text-white"}`}
                        style={{ 
                          maxWidth: "80%", 
                          wordBreak: "break-word", 
                          fontSize: "0.95rem", 
                          lineHeight: "1.5", 
                          backgroundImage: msg.isBot ? "none" : "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
                          backgroundColor: msg.isBot ? "#EAF2F0" : "transparent"
                        }}
                      >
                        <div className="d-flex align-items-start gap-1">
                          {msg.isBot && <span className="me-1">🤖</span>}
                          <div>
                            {msg.isHTML ? <span dangerouslySetInnerHTML={{ __html: msg.text }} /> : msg.text}
                          </div>
                        </div>

                        <div className="text-end mt-2" style={{ fontSize: "0.7rem", opacity: 0.6, color: msg.isBot ? "#555" : "#d1dfd2" }}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div id="typing-indicator-container" className="d-flex justify-content-start mb-3 w-100">
                      <div className="p-3 rounded-4 d-flex align-items-center gap-1 border-0 shadow-sm" style={{ backgroundColor: "#EAF2F0", height: "45px" }}>
                        <div style={{ width: "6px", height: "6px", background: "#2a402c", borderRadius: "50%", animation: "blink 1.4s infinite both" }}></div>
                        <div style={{ width: "6px", height: "6px", background: "#2a402c", borderRadius: "50%", animation: "blink 1.4s infinite both", animationDelay: "0.2s" }}></div>
                        <div style={{ width: "6px", height: "6px", background: "#2a402c", borderRadius: "50%", animation: "blink 1.4s infinite both", animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white border-top border-light p-3">
                  <div className="input-group align-items-center">
                    <input 
                      id="mensagemInput" 
                      type="text" 
                      className="form-control border-1 border-light-subtle rounded-pill px-4 py-2"
                      placeholder="Digite sua dúvida aqui..." 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      disabled={isTyping}
                      style={{ fontSize: "0.95rem" }}
                    />
                    <button 
                      id="btnEnviar" 
                      className="btn btn-success rounded-circle ms-2 d-flex align-items-center justify-content-center shadow-sm" 
                      onClick={() => handleSend()}
                      disabled={isTyping}
                      style={{ width: "42px", height: "42px" }}
                    >
                      <i className="bi bi-send-fill fs-6" />
                    </button>
                  </div>
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