"use client";

import { useState, useEffect } from "react";

export default function aside() {
  const [usuario, setUsuario] = useState(null);

  // 1. Carrega as informações do perfil salvas pelo login
  const carregarUsuario = () => {
    const perfilSalvo = localStorage.getItem("perfil");
    if (perfilSalvo) {
      try {
        setUsuario(JSON.parse(perfilSalvo));
      } catch (e) {
        console.error("Erro ao converter perfil na Sidebar", e);
      }
    } else {
      setUsuario(null);
    }
  };

  useEffect(() => {
    carregarUsuario();

    // Fica de olho caso o storage mude (atualiza a sidebar se logar/deslogar)
    window.addEventListener("storage", carregarUsuario);
    return () => window.removeEventListener("storage", carregarUsuario);
  }, []);

  // 2. Mapeamento dos menus baseado no 'usuario.tipo' vindo do seu Banco de Dados
  const menuConfig = {
    // VISITANTE / SEM CADASTRO (Se não houver usuário logado)
    guest: {
      title: "Menu Principal",
      links: [
        { label: "Home", href: "./", icon: "bi-house-fill" },
        { label: "Vagas", href: "./vagasSemCadastro", icon: "bi-person-badge" },
      ]
    },
    // CANDIDATO
    candidato: {
      title: "Menu Principal",
      links: [
        { label: "Home", href: "./dashboard/candidato", icon: "bi-house-fill" },
        { label: "Vagas", href: "../vagas", icon: "bi-person-badge" },
        { label: "Match", href: "../matchCandidato", icon: "bi-chat-square-heart-fill" },
        { label: "Assistente", href: "../assistente", icon: "bi-phone-fill" },
        { label: "Seu Perfil", href: "../editarPerfil", icon: "bi-person-fill" },
      ]
    },
    // EMPRESA
    empresa: {
      title: "Painel Empresa",
      links: [
        { label: "Dashboard", href: "../dashboard/empresa", icon: "bi-speedometer2" },
        { label: "Criar Vaga", href: "../cadastrarVaga", icon: "bi-plus-circle-fill" },
        { label: "Minhas Vagas", href: "../vagasEmpresa", icon: "bi-briefcase-fill" },
        { label: "Candidatos", href: "../empresaCandidatos", icon: "bi-people-fill" },
        { label: "Perfil Empresa", href: "../editarPerfilEmpresa", icon: "bi-building" },
        { label: "Assistente", href: "../assistente", icon: "bi-phone-fill" },
      ]
    },
    // ADMIN / ADMINISTRADOR
    admin: {
      title: "Administração",
      links: [
        { label: "Painel Geral", href: "../dashboard/admin", icon: "bi-shield-lock-fill" },
        { label: "Gerenciar Usuários", href: "../Admin/Usuarios", icon: "bi-people" },
        { label: "Gerenciar Vagas", href: "../Admin/Vagas", icon: "bi-check2-square" },
        { label: "Relatórios", href: "../Admin/Relatorios", icon: "bi-bar-chart-line-fill" },
      ]
    }
  };

  // Descobre qual menu renderizar (se não tiver logado, pega o 'guest')
  const tipoUsuario = usuario?.tipo ? usuario.tipo.toLowerCase() : "guest";
  const currentMenu = menuConfig[tipoUsuario] || menuConfig.guest;

  return (
    <aside 
      id="sidebar" 
      className="offcanvas-md offcanvas-start bg-menu shadow position-fixed top-0 start-0 h-100 border-0"
      tabIndex={-1}
    >
      {/* HEADER DO ASIDE (MOBILE) */}
      <div className="offcanvas-header d-md-none border-bottom border-dark border-opacity-10 mt-2">
        <h5 className="offcanvas-title texto-escuro fw-bold fs-3">Menu</h5>
        <button 
          type="button" 
          className="btn-close shadow-none" 
          data-bs-dismiss="offcanvas"
          data-bs-target="#sidebar"
        ></button>
      </div>

      {/* CORPO DO ASIDE */}
      <div className="offcanvas-body d-flex flex-column p-0 h-100 overflow-x-hidden">
        
        {/* BARRA DE BUSCA */}
        <div className="px-3 mt-4 mb-2 hide-on-collapse">
          <div className="input-group input-group-sm">
            <span 
              className="input-group-text bg-transparent border-end-0 text-muted"
              style={{ borderColor: '#162417' }}
            >
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control bg-transparent border-start-0 ps-0 shadow-none"
              style={{ borderColor: '#162417' }} 
              placeholder="Buscar..." 
            />
          </div>
        </div>

        {/* TÍTULO DA SEÇÃO (ALTERA CONFORME O PERFIL) */}
        <div className="px-4 mt-3 mb-2 text-uppercase fw-bold text-muted small hide-on-collapse">
          {currentMenu.title}
        </div>

        {/* LINKS DINÂMICOS AUTOMÁTICOS */}
        <nav className="nav flex-column gap-1 p-2 flex-grow-1">
          {currentMenu.links.map((link, index) => (
            <a 
              key={index}
              href={link.href} 
              className="nav-link d-flex align-items-center justify-content-between texto-escuro fw-medium rounded py-2 link-hover"
            >
              <div className="d-flex align-items-center">
                <div className="text-center" style={{ minWidth: '40px' }}>
                  <i className={`bi ${link.icon} fs-5`}></i>
                </div>
                <span className="hide-on-collapse ms-2">{link.label}</span>
              </div>
            </a>
          ))}
        </nav>

      </div>
    </aside>
  );
}