"use client";

import React, { useEffect, useState } from "react";

export default function PainelCandidato() {
  const [cursos, setCursos] = useState([]);
  const [cursosComprados, setCursosComprados] = useState([]);

  useEffect(() => {
    buscarCursos();
    buscarCursosComprados();
  }, []);

  function irPagamento(id) {
  window.location.href = `/pagamentoCurso/${id}`;
}

  async function buscarCursos() {
    try {
      const response = await fetch(
        "http://localhost:3001/api/cursos"
      );

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

  async function comprarCurso(id) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3001/api/cursos/${id}/comprar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      alert(data.mensagem);

      if (data.sucesso) {
        buscarCursosComprados();
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

  return (
    <main
      id="main-content"
      className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4"
    >
      <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
        <div
          className="p-4 p-md-5 shadow-lg text-white cor-main d-flex flex-column flex-grow-1"
          style={{
            borderRadius: "0",
            borderTopLeftRadius: "30px",
          }}
        >
          <h1 className="display-3 fw-bolder mb-4 lh-sm">
            Cursos para
            <br />
            <span className="text-success">
              Aperfeiçoamento!
            </span>
          </h1>

          <div className="row g-4 justify-content-center">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                className="col-12 col-md-6 col-lg-4"
              >
                <div
                  className="card h-100 shadow rounded-4"
                  style={{ backgroundColor: "#9DC5BB" }}
                >
                  <div className="card-body p-4 d-flex flex-column">
                    <span className="badge bg-dark bg-opacity-10 text-dark align-self-start mb-3 px-3 py-2 rounded-pill fw-semibold">
                      Curso {curso.id}
                    </span>

                    <h5 className="card-title fw-bold text-dark mb-3">
                      {curso.titulo}
                    </h5>

                    <p className="text-dark">
                      {curso.descricao}
                    </p>

                    <h4 className="text-dark fw-bold mb-4">
                      R$ {Number(curso.valor).toFixed(2)}
                    </h4>

                    <div className="mt-auto d-flex gap-2">
                      {!possuiCurso(curso.id) && (
                        <button
                          className="btn btn-success flex-fill"
                          onClick={() => irPagamento(curso.id)}
                        >
                          Comprar
                        </button>
                      )}

                      {possuiCurso(curso.id) ? (
                        <button
                          className="btn btn-dark flex-fill"
                          onClick={() => abrirCurso(curso.id)}
                        >
                          Abrir
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary flex-fill"
                          disabled
                        >
                          Bloqueado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
