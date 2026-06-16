"use client";

import React, { useState, useEffect } from "react";

export default function DashboardCandidato() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("DASHBOARD DATA:", data);
    }, [data]);

    useEffect(() => {
        async function carregar() {
            try {
                const token = localStorage.getItem("token");

                console.log("TOKEN DO FRONT:", token);

                if (!token) {
                    setLoading(false);
                    return;
                }


                const res = await fetch("http://localhost:3001/api/dashboard/candidato", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const json = await res.json();

                if (!res.ok) {
                    console.log("Erro API:", json);
                    setLoading(false);
                    return;
                }

                setData(json);
            } catch (err) {
                console.log("Erro fetch:", err);
            } finally {
                setLoading(false);
            }
        }

        carregar();
    }, []);

    if (loading) {
        return (
            <main className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4 align-items-center justify-content-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </main>
        );
    }

    return (
<main
    id="main-content"
    className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4"
  >
    <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
      <div
        className="p-4 p-md-5 shadow-lg text-white cor-main d-flex flex-column flex-grow-1"
        style={{ borderRadius: 0, borderTopLeftRadius: 30 }}
      >
        <div className="row align-items-center g-5 mb-5">
          <div className="col-12 col-xl-7">
            <span className="badge rounded-pill bg-success-subtle text-success-emphasis px-3 py-2 mb-4 fw-semibold">
              Plataforma Inteligente de Recrutamento
            </span>
            <h1 className="display-3 fw-bold lh-1 mb-4">
              O seu futuro
              <span className="text-success"> recomeçou </span>
              aqui.
            </h1>
            <p className="fs-5 text-white-50 lh-lg col-lg-10 mb-4">
              Conectamos você a empresas que garantem seu futuro. Escolhe algum
              a baixo para começar:
            </p>
            <div className="d-flex flex-wrap gap-3">
              <a
                href="../vagas"
                className="btn btn-segundo btn-lg px-4 fw-semibold"
              >
                Ver Vagas
              </a>
              <a
                href="../matchCandidato"
                className="btn btn-segundo btn-lg px-4 fw-semibold"
              >
                Ver Matchs
              </a>
              <a
                href="../editarPerfil"
                className="btn btn-segundo btn-lg px-4 fw-semibold"
              >
                Ver o seu Peril
              </a>
            </div>
          </div>
          <article>
            <div className="row g-4">
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#162417",
                  margin: 0,
                  padding: 0,
                  overflow: "hidden",
                  borderRadius: 20
                }}
              >
                <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  style={{ width: "100%", margin: 0, padding: 0 }}
                >
                  <div className="carousel-indicators">
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to={0}
                      className="active"
                      aria-current="true"
                      aria-label="Slide 1"
                    />
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to={1}
                      aria-label="Slide 2"
                    />
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to={2}
                      aria-label="Slide 3"
                    />
                  </div>
                  <div
                    className="carousel-inner"
                    style={{ width: "100%", margin: 0, padding: 0 }}
                  >
                    <div
                      className="carousel-item active"
                      style={{ width: "100%" }}
                    >
                      <img
                        src="../Candidato1.png"
                        className="d-block w-100"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          margin: 0,
                          padding: 0,
                          border: "none"
                        }}
                        alt="MatchHire"
                      />
                    </div>
                    <div className="carousel-item" style={{ width: "100%" }}>
                      <img
                        src="../Candidato2.png"
                        className="d-block w-100"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          margin: 0,
                          padding: 0,
                          border: "none"
                        }}
                        alt="..."
                      />
                    </div>
                    <div className="carousel-item" style={{ width: "100%" }}>
                      <img
                        src="../Candidato3.png"
                        className="d-block w-100"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          margin: 0,
                          padding: 0,
                          border: "none"
                        }}
                        alt="..."
                      />
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <span className="text-muted">Nossa história</span>
                <h2 className="display-5 fw-bold">Sobre nós</h2>
                <p className="lead">
                  Criada em 2026 através de um projeto integrador no Senai que
                  evoluiu para um site profissional de uso empresarial e para
                  recrutamento de candidatos.
                </p>
              </div>
              <div className="col-md-6 offset-md-1">
                <p className="lead">
                  A MatchHire ajuda empresas a encontrarem os profissionais mais
                  compatíveis com suas vagas de forma rápida e eficiente. Com
                  uma plataforma moderna e intuitiva, o recrutamento se torna
                  mais organizado, reduzindo o tempo de contratação e aumentando
                  as chances de encontrar o talento ideal.
                </p>
                <p className="lead">
                  Ela também conecta candidatos a oportunidades alinhadas com
                  suas habilidades, experiências e objetivos profissionais. A
                  plataforma facilita a busca por vagas, tornando o processo de
                  candidatura mais simples e aumentando as chances de encontrar
                  a oportunidade certa para crescer na carreira.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="lista mb-2">
          <div className="item">
            <img src="../1.png" alt="MAt" />
            <p>
              A MatchHire conecta empresas e candidatos de forma rápida, moderna
              e eficiente. Nossa plataforma facilita o recrutamento, tornando a
              busca por talentos muito mais simples e prática.
            </p>
          </div>
          <div className="lista">
            <div className="item">
              <img src="../2.png" alt="chH" />
              <p>
                Na MatchHire, empresas encontram profissionais qualificados e
                candidatos descobrem novas oportunidades de carreira. Tudo em um
                ambiente intuitivo e acessível.
              </p>
            </div>
          </div>
          <div className="lista">
            <div className="item">
              <img src="../3.png" alt="ire" />
              <p>
                A MatchHire foi criada para transformar o processo de
                contratação, aproximando talentos e empresas através de
                tecnologia, agilidade e inovação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
    );
}