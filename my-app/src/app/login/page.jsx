"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [abaAtiva, setAbaAtiva] = useState("empresa");

  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [senhaEmpresa, setSenhaEmpresa] = useState("");

  const [emailCandidato, setEmailCandidato] = useState("");
  const [senhaCandidato, setSenhaCandidato] = useState("");

  const [erro, setErro] = useState("");

  const enviarLogin = async (identificador, senha, tipoAbaSelecionada) => {
  setErro("");

  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identificador: identificador,
        senha: senha,
      }),
    });

    const dados = await response.json();

    if (!response.ok) {
      throw new Error(dados.erro || "E-mail ou senha incorretos.");
    }

    const tipoUsuarioReal = dados.perfil?.tipo;

    if (tipoAbaSelecionada === "empresa" && tipoUsuarioReal === "candidato") {
      throw new Error("Este e-mail pertence a um Candidato. Por favor, use a aba ao lado para entrar.");
    }

    if (tipoAbaSelecionada === "candidato" && tipoUsuarioReal === "empresa") {
      throw new Error("Este e-mail pertence a uma Empresa. Por favor, use a aba ao lado para entrar.");
    }

    console.log("Login autorizado com sucesso!", dados);

    localStorage.setItem("token", dados.token);
    localStorage.setItem("perfil", JSON.stringify(dados.perfil));

    window.dispatchEvent(new Event("storage"));

    if (tipoUsuarioReal === "empresa") {
      window.location.href = "/dashboard/empresa";
    } else if (tipoUsuarioReal === "candidato") {
      window.location.href = "/dashboard/candidato";
    } else if (tipoUsuarioReal === "admin") {
      window.location.href = "/dashboard/admin";
    }

  } catch (err) {
    console.error("Erro detectado no login:", err.message);
    setErro(err.message);
  }
};

  const handleLoginEmpresa = (e) => {
    e.preventDefault();
    enviarLogin(emailEmpresa, senhaEmpresa, "empresa");
  };

  const handleLoginCandidato = (e) => {
    e.preventDefault();
    enviarLogin(emailCandidato, senhaCandidato, "candidato");
  };

  const alternarAba = (aba) => {
    setErro("");
    setAbaAtiva(aba);
  };

  return (
    <>
      <main
        id="main-content"
        className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4"
      >
        <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
          <div
            className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1 justify-content-center"
            style={{
              backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
              borderRadius: 0,
              borderTopLeftRadius: 30
            }}
          >
            
            {erro && (
              <div className="alert alert-danger mx-auto text-center w-100 mb-4" style={{ maxWidth: "450px", borderRadius: "12px" }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {erro}
              </div>
            )}

            <div className="row w-100 justify-content-center mx-0">
              <div className="col-12 px-0">
                
                {/* BOTÕES DE NAVEGAÇÃO ENTRE AS ABAS */}
                <div className="d-flex justify-content-center mb-4">
                  <ul className="nav nav-pills gap-3" id="pills-tab-login" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link nav-link-button rounded-pill px-4 py-2 fs-5 ${abaAtiva === "empresa" ? "active" : ""}`}
                        type="button"
                        onClick={() => alternarAba("empresa")}
                      >
                        <i className="bi bi-building me-2" />
                        Empresa
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link nav-link-button rounded-pill px-4 py-2 fs-5 ${abaAtiva === "candidato" ? "active" : ""}`}
                        type="button"
                        onClick={() => alternarAba("candidato")}
                      >
                        <i className="bi bi-person-vcard me-2" />
                        Candidato
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="tab-content" id="pills-tabContent-login">
                  
                  {/* FORMULÁRIO DE EMPRESA */}
                  {abaAtiva === "empresa" && (
                    <div className="p-4 p-md-5 text-dark shadow-lg login-card cor-fundo">
                      <div className="text-center mb-4">
                        <div className="mb-3">
                          <i className="bi bi-building" style={{ fontSize: "3.5rem", color: "#162417" }} />
                        </div>
                        <h2 className="fw-bold font-georgia mb-2" style={{ color: "#162417" }}>
                          Acesso Empresarial
                        </h2>
                        <p className="text-dark opacity-75 small">
                          Gerencie suas vagas e encontre talentos.
                        </p>
                      </div>
                      <form onSubmit={handleLoginEmpresa}>
                        <div className="mb-3">
                          <label className="form-label fw-medium" style={{ color: "#162417" }}>
                            <i className="bi bi-envelope me-2" />
                            E-mail Corporativo
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-custom"
                            placeholder="rh@empresa.com"
                            required
                            value={emailEmpresa}
                            onChange={(e) => setEmailEmpresa(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label className="form-label fw-medium" style={{ color: "#162417" }}>
                            <i className="bi bi-lock me-2" />
                            Senha
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-custom"
                            placeholder="Digite sua senha"
                            required
                            value={senhaEmpresa}
                            onChange={(e) => setSenhaEmpresa(e.target.value)}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-4 small">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="lembrarEmpresa"
                              style={{ cursor: "pointer", borderColor: "#162417" }}
                            />
                            <label className="form-check-label text-dark fw-medium" htmlFor="lembrarEmpresa" style={{ cursor: "pointer" }}>
                              Lembrar de mim
                            </label>
                          </div>
                          <a href="./recuperarSenha" className="link-custom">
                            Esqueceu a senha?
                          </a>
                        </div>
                        <button type="submit" className="btn-primeiro rounded-5 w-100 fs-5 py-2 mb-4">
                          Entrar como Empresa
                        </button>
                        <div className="text-center mt-2 border-top border-dark border-opacity-10 pt-4">
                          <p className="mb-0 text-dark small">
                            Sua empresa ainda não tem conta? <br />
                            <a href="/cadastro" className="link-custom mt-1 d-inline-block">
                              <i className="bi bi-box-arrow-in-right me-1" />
                              Cadastre-se aqui
                            </a>
                          </p>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* FORMULÁRIO DE CANDIDATO */}
                  {abaAtiva === "candidato" && (
                    <div className="p-4 p-md-5 text-dark shadow-lg login-card cor-fundo">
                      <div className="text-center mb-4">
                        <div className="mb-3">
                          <i className="bi bi-person-circle" style={{ fontSize: "3.5rem", color: "#162417" }} />
                        </div>
                        <h2 className="fw-bold font-georgia mb-2" style={{ color: "#162417" }}>
                          Acesso do Candidato
                        </h2>
                        <p className="text-dark opacity-75 small">
                          Acesse seu perfil e encontre a vaga ideal.
                        </p>
                      </div>
                      <form onSubmit={handleLoginCandidato}>
                        <div className="mb-3">
                          <label className="form-label fw-medium" style={{ color: "#162417" }}>
                            <i className="bi bi-envelope me-2" />
                            E-mail Pessoal
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-custom"
                            placeholder="seuemail@provedor.com"
                            required
                            value={emailCandidato}
                            onChange={(e) => setEmailCandidato(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label className="form-label fw-medium" style={{ color: "#162417" }}>
                            <i className="bi bi-lock me-2" />
                            Senha
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-custom"
                            placeholder="Digite sua senha"
                            required
                            value={senhaCandidato}
                            onChange={(e) => setSenhaCandidato(e.target.value)}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-4 small">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="lembrarCandidato"
                              style={{ cursor: "pointer", borderColor: "#162417" }}
                            />
                            <label className="form-check-label text-dark fw-medium" htmlFor="lembrarCandidato" style={{ cursor: "pointer" }}>
                              Lembrar de mim
                            </label>
                          </div>
                          <a href="./recuperarSenha" className="link-custom">
                            Esqueceu a senha?
                          </a>
                        </div>
                        <button type="submit" className="btn-primeiro rounded-5 w-100 fs-5 py-2 mb-4">
                          Entrar como Candidato
                        </button>
                        <div className="text-center mt-2 border-top border-dark border-opacity-10 pt-4">
                          <p className="mb-0 text-dark small">
                            Ainda não tem o seu perfil? <br />
                            <a href="/cadastro" className="link-custom mt-1 d-inline-block">
                              <i className="bi bi-box-arrow-in-right me-1" />
                              Cadastre-se aqui
                            </a>
                          </p>
                        </div>
                      </form>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}