"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [usuario, setUsuario] = useState(null);

  // Carrega as informações salvas pelo login assim que a página abre
  const carregarUsuario = () => {
    const perfilSalvo = localStorage.getItem("perfil");
    if (perfilSalvo) {
      try {
        setUsuario(JSON.parse(perfilSalvo));
      } catch (e) {
        console.error("Erro ao converter perfil", e);
      }
    } else {
      setUsuario(null);
    }
  };

  useEffect(() => {
    carregarUsuario();

    // Fica de olho caso o storage mude (atualiza o header se logar/deslogar)
    window.addEventListener("storage", carregarUsuario);
    return () => window.removeEventListener("storage", carregarUsuario);
  }, []);

  // 🔥 FUNÇÃO DE LOGOUT ATUALIZADA
  const fazerLogout = () => {
    // 1. Limpa os dados do navegador
    localStorage.removeItem("token");
    localStorage.removeItem("perfil");
    setUsuario(null);
    
    // 2. Fecha a sidebar do Bootstrap removendo o efeito visual de fundo escuro
    const offcanvasElement = document.getElementById("offcanvasProfile");
    if (offcanvasElement) {
      // Se o Bootstrap global estiver ativo, força o fechamento correto
      const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
      bsOffcanvas?.hide();
      
      // Garante que o fundo escuro (backdrop) suma mesmo se o Bootstrap travar
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) backdrop.remove();
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    }

    // 3. Redireciona de forma absoluta para a página Home
    window.location.href = "/login";
  };

  return (
    <>
      <nav
        className="navbar fixed-top shadow-sm py-2 cor-fundo"
        style={{ zIndex: 1050 }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-between px-3 px-md-4">
          
          {/* SEÇÃO DA ESQUERDA: LOGO */}
          <div className="d-flex align-items-center gap-2 flex-fill">
            <button
              className="btn btn-outline-dark border-0 fs-4 d-md-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebar"
            >
              <i className="bi bi-list" />
            </button>
            <a
              className="navbar-brand d-flex align-items-center fs-3 m-0 p-0 texto-escuro"
              href="./"
            >
              Match<span className="text-white">Hire</span>
              <img
                src="./logo.png"
                className="ms-2 d-none d-sm-block img-fluid"
                style={{ height: 40 }}
                alt=""
              />
            </a>
          </div>

          {/* SEÇÃO DO MEIO: HOME */}
          <div className="text-center d-none d-md-block flex-fill">
            <a href="./" className="fs-2 fw-bold text-decoration-none texto-escuro">
              HOME
            </a>
          </div>

          {/* SEÇÃO DA DIREITA: BOTÕES OU FOTO DE PERFIL */}
          <div className="d-flex align-items-center justify-content-end flex-fill gap-3">
            
            {/* SE NÃO ESTIVER LOGADO -> MOSTRA OS BOTÕES PADRÃO */}
            {!usuario ? (
              <>
                <a
                  href="./login"
                  className="btn btn-primeiro rounded-5 px-4 py-2 fw-semibold d-none d-sm-block"
                >
                  Entrar
                </a>
                <a
                  href="/cadastro"
                  className="btn btn-primeiro rounded-5 px-4 py-2 fw-semibold d-none d-sm-block"
                >
                  Cadastre-se
                </a>
              </>
            ) : (
              /* SE ESTIVER LOGADO -> EXIBE A FOTO E O NOME (DESKTOP) */
              <div className="d-none d-sm-flex align-items-center gap-2">
                <span className="texto-escuro small fw-medium">
                  Olá, <strong className="text-white">{usuario.nome?.split(" ")[0]}</strong>!
                </span>
                <button
                  className="border-0 bg-transparent p-0 shadow-none"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasProfile"
                  style={{ width: "42px", height: "42px" }}
                >
                  <img
                    src={usuario.foto || "personagem.png"}
                    className="rounded-circle border border-2 border-dark"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    alt="Perfil"
                  />
                </button>
              </div>
            )}

            {/* BOTÃO MOBILE */}
            <button
              className="border-0 bg-transparent p-0 shadow-none d-sm-none texto-escuro fs-1"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target={usuario ? "#offcanvasProfile" : "#sidebarConta"}
            >
              {usuario ? (
                <img
                  src={usuario.foto || "personagem.png"}
                  className="rounded-circle border border-2 border-dark"
                  style={{ width: "40px", height: "40px", objectFit: "cover", display: "block" }}
                  alt="Perfil"
                />
              ) : (
                <i className="bi bi-person-circle" />
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* 🛠️ SIDEBAR / OFF CANVAS DE PERFIL DINÂMICO (Adicionado aqui dentro!) */}
      <div 
        className="offcanvas offcanvas-end cor-fundo border-0 shadow" 
        tabIndex={-1} 
        id="offcanvasProfile"
        style={{ color: "#162417" }}
      >
        <div className="offcanvas-header shadow-sm border-0">
          <h5 className="offcanvas-title fw-bold">Seu Perfil</h5>
          <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" />
        </div>
        
        <div className="offcanvas-body">
          {usuario ? (
            <>
              <div className="text-center mb-4">
                <img
                  src={usuario.foto || "personagem.png"}
                  className="rounded-circle border border-3 border-white shadow"
                  style={{ height: 120, width: 120, objectFit: "cover" }}
                  alt="Foto de perfil"
                />
                <h4 className="mt-3 mb-0 fw-bold">{usuario.nome}</h4>
                <span className="badge bg-dark mt-2">ID #{usuario.id || "---"}</span>
              </div>
              
              <div className="d-flex flex-column gap-3 mt-4">
                <div className="bg-white bg-opacity-25 p-3 rounded-3 shadow-sm">
                  <i className="bi bi-envelope-fill me-2" />{" "}
                  <small className="fw-bold">Email:</small>
                  <br />
                  {usuario.email}
                </div>
                
                <div className="bg-white bg-opacity-25 p-3 rounded-3 shadow-sm">
                  <i className="bi bi-shield-lock-fill me-2" />{" "}
                  <small className="fw-bold">Tipo de Conta:</small>
                  <br />
                  <span className="text-capitalize fw-semibold">{usuario.tipo}</span>
                </div>

                {/* Exibe o botão de currículo apenas se for candidato */}
                {usuario.tipo === "candidato" && (
                  <a href="#" className="btn btn-dark w-100 py-2 mt-2 shadow-sm">
                    <i className="bi bi-file-earmark-pdf-fill me-2" /> Abrir Meu Currículo
                  </a>
                )}

                {/* BOTÃO QUE VALIDA O LOGOUT ACIMA */}
                <button 
                  onClick={fazerLogout} 
                  className="btn btn-danger w-100 py-2 mt-auto shadow-sm fw-medium"
                >
                  <i className="bi bi-box-arrow-right me-2" /> Sair da Conta
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Nenhum usuário conectado.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}