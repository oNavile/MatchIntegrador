"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [usuario, setUsuario] = useState(null);

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
    window.addEventListener("storage", carregarUsuario);
    return () => window.removeEventListener("storage", carregarUsuario);
  }, []);

  const fazerLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("perfil");
    setUsuario(null);

    const offcanvasElement = document.getElementById("offcanvasProfile");
    if (offcanvasElement) {
      const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
      bsOffcanvas?.hide();

      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) backdrop.remove();
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    }

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
                src="/logo.png"
                className="ms-2 d-none d-sm-block img-fluid"
                style={{ height: 40 }}
                alt="Logo"
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
                  {/* 🔥 MODIFICADO: Se tiver foto, monta a URL do backend. Se não, usa o padrão. */}
                  <img
                    src={usuario.foto && !usuario.foto.endsWith('.pdf') ? usuario.foto : "/personagem.png"}
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
                /* 🔥 MODIFICADO: URL Dinâmica da Foto Mobile */
                <img
                  src={usuario.foto && !usuario.foto.endsWith('.pdf') ? usuario.foto : "/personagem.png"}
                  className="rounded-circle border border-2 border-dark"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt="Perfil"
                />
              ) : (
                <i className="bi bi-person-circle" />
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* 🛠️ SIDEBAR / OFF CANVAS DE PERFIL DINÂMICO */}
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
                {/* 🔥 MODIFICADO: URL Dinâmica da Foto na Sidebar Grande */}
                <img
                  src={usuario.foto && !usuario.foto.endsWith('.pdf') ? usuario.foto : "/personagem.png"}
                  className="rounded-circle border border-2 border-dark"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt="Perfil"
                />
                <h4 className="mt-3 mb-0 fw-bold">{usuario.nome}</h4>
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
                {usuario.tipo === "candidato" && usuario.curriculo && (
                  <a
                    href={usuario.curriculo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-dark w-100 py-2 mt-2 shadow-sm"
                  >
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