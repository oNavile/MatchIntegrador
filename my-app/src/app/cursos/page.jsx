"use client";

import React, { useEffect, useState } from "react";

export default function PainelCandidato() {
  const [cursos, setCursos] = useState([]);
  const [cursosComprados, setCursosComprados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([buscarCursos(), buscarCursosComprados()]).finally(() => {
      setLoading(false);
    });
  }, []);

  function irPagamento(id) {
    window.location.href = `/pagamentoCurso/${id}`;
  }

  async function buscarCursos() {
    try {
      const response = await fetch("http://localhost:3001/api/cursos");
      const data = await response.json();
      if (data.sucesso) {
        setCursos(data.dados);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function buscarCursosComprados() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3001/api/cursos/meus-cursos",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();

      if (data.sucesso) {
        setCursosComprados(
          data.dados
            .filter(curso => curso.curso_id !== null)
            .map(curso => curso.curso_id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  function abrirCurso(id) {
    window.location.href = `/cursos/${id}`;
  }

  function possuiCurso(id) {
    return cursosComprados.includes(id);
  }

  if (loading) {
    return (
      <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4 mb-0 pb-0">
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
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 border-bottom border-dark border-opacity-10 pb-4">
                <div>
                  <h2 className="fw-bold font-georgia mb-2 text-dark">
                    <i className="bi bi-journal-bookmark-fill me-2 text-success" />
                    Cursos para Aperfeiçoamento
                  </h2>
                  <p className="text-muted small mb-0">
                    Turbine o seu perfil profissional! Adquira competências requisitadas pelo mercado de trabalho e ganhe destaque nos processos seletivos.
                  </p>
                </div>
                <div className="mt-3 mt-md-0">
                  <span className="badge bg-dark rounded-pill px-4 py-2 shadow-sm text-white fw-bold">
                    Painel do Candidato
                  </span>
                </div>
              </div>
              <div className="row g-4">
                {cursos.map((curso) => (
                  <div key={curso.id} className="col-12 col-md-6 col-xl-4">
                    <div 
                      className="card border-0 rounded-4 shadow-sm h-100" 
                      style={{ backgroundColor: "#EAF2F0" }}
                    >
                      <div className="card-body p-4 d-flex flex-column text-dark">
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-bold border border-success border-opacity-10 small">
                            Treinamento
                          </span>
                          <span className="text-muted small fw-medium">
                            Módulo #{curso.id}
                          </span>
                        </div>

                        <h5 className="fw-bold font-georgia text-dark mb-2">
                          {curso.titulo}
                        </h5>

                        <p className="text-secondary small mb-4 lh-base flex-grow-1">
                          {curso.descricao}
                        </p>

                        <div className="d-flex align-items-baseline mb-4">
                          <span className="text-success small fw-bold me-1">R$</span>
                          <h3 className="fw-bold text-dark font-georgia mb-0">
                            {Number(curso.valor).toFixed(2)}
                          </h3>
                        </div>
                        <div className="d-flex gap-2">
                          {!possuiCurso(curso.id) ? (
                            <button
                              className="btn btn-success fw-bold px-4 py-2 rounded-3 shadow-sm flex-fill"
                              onClick={() => irPagamento(curso.id)}
                            >
                              <i className="bi bi-cart-plus me-2" /> Comprar
                            </button>
                          ) : (
                            <button
                              className="btn btn-dark fw-bold px-4 py-2 rounded-3 shadow-sm flex-fill"
                              onClick={() => abrirCurso(curso.id)}
                            >
                              <i className="bi bi-play-circle me-2" /> Abrir Módulo
                            </button>
                          )}

                          {!possuiCurso(curso.id) && (
                            <button
                              className="btn btn-secondary px-3 py-2 rounded-3"
                              disabled
                              title="Adquira este módulo para desbloquear o acesso"
                            >
                              <i className="bi bi-lock-fill" />
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {cursos.length === 0 && (
                <div className="text-center py-5 rounded-4 bg-white bg-opacity-25 mt-2">
                  <i className="bi bi-journal-x display-4 text-muted" />
                  <h5 className="fw-bold mt-3 text-dark font-georgia">Nenhum curso disponível</h5>
                  <p className="text-muted small px-3 mb-0">Volte mais tarde para verificar as novas certificações da MatchHire.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}