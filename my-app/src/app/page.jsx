"Use Client"

import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
   <>
  <title>MatchHire - Sem Bordas e Com Profundidade</title>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        \n        :root {\n            --bg-main: #9DC5BB;\n            --bg-dark: #162417;\n        }\n\n        body {\n            background-color: var(--bg-main);\n            overflow-x: hidden;\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n        }\n\n        .bg-main {\n            background-color: var(--bg-main) !important;\n        }\n\n        .bg-dark-custom {\n            background-color: var(--bg-dark) !important;\n        }\n\n        .text-dark-custom {\n            color: var(--bg-dark) !important;\n        }\n\n        .font-georgia {\n            font-family: Georgia, 'Times New Roman', serif;\n        }\n\n        .nav-link-hover:hover,\n        .nav-link-hover.active {\n            background-color: var(--bg-dark);\n            color: white !important;\n        }\n                .btn-login {\n            color: var(--bg-dark);\n            font-weight: 600;\n            transition: all 0.3s ease;\n        }\n        .btn-login:hover {\n            color: var(--accent-color);\n            transform: translateY(-2px);\n        }\n\n        .btn-register {\n            background-color: var(--bg-dark);\n            color: white;\n            font-weight: bold;\n            border-radius: 50px;\n            padding: 0.5rem 1.5rem;\n            transition: all 0.3s ease;\n            box-shadow: 0 4px 15px rgba(22, 36, 23, 0.2);\n        }\n        .btn-register:hover {\n            background-color: var(--accent-color);\n            color: white;\n            transform: translateY(-2px);\n            box-shadow: 0 6px 20px rgba(23, 184, 144, 0.4);\n        }\n\n         \n        @media (min-width: 768px) {\n            #sidebar {\n                width: 80px;\n                transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n                white-space: nowrap;\n                z-index: 1040;\n                padding-top: 85px;\n                \n            }\n\n            #sidebar:hover {\n                width: 260px;\n            }\n\n            .hide-on-collapse {\n                opacity: 0;\n                transition: opacity 0.2s ease;\n                visibility: hidden;\n            }\n\n            #sidebar:hover .hide-on-collapse {\n                opacity: 1;\n                visibility: visible;\n                transition-delay: 0.1s;\n            }\n\n            \n            #main-content,\n            #footer {\n                margin-left: 80px;\n                width: calc(100% - 80px);\n            }\n        }\n\n        .bg-aside {\n            background-color: #9DC5BB !important;\n            \n        }\n    "
    }}
  />
  <main
    id="main-content"
    className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4"
  >
    <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
      <div
        className="p-4 p-md-5 shadow-lg text-white bg-dark-custom d-flex flex-column flex-grow-1"
        style={{
          backgroundImage: "linear-gradient",
          borderRadius: 0,
          borderTopLeftRadius: 30
        }}
      >
        <div className="row align-items-center g-5 mb-5">
          <div className="col-12 col-xl-7">
            <span className="badge rounded-pill bg-success-subtle text-success-emphasis px-3 py-2 mb-4 fw-semibold">
              Plataforma Inteligente de Recrutamento
            </span>
            <h1 className="display-3 fw-bold lh-1 mb-4">
              O futuro do
              <span className="text-success"> recrutamento </span>
              começa aqui.
            </h1>
            <p className="fs-5 text-white-50 lh-lg col-lg-10 mb-4">
              Conectamos talentos e empresas com automação inteligente, análise
              de perfil e decisões orientadas por dados.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <a href="./cadastroCliente" className="btn btn-success btn-lg px-4 fw-semibold">
                Começar Agora
              </a>
              <a
                href="vagas"
                className="btn btn-outline-light btn-lg px-4 fw-semibold"
              >
                Ver Plataforma
              </a>
            </div>
          </div>
          <article>
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
                      src="./Banner1.png"
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
                      src="./Banner1.png"
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
                      src="./Banner2.png"
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
          </article>
          <div className="row g-4">
            <div className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 border-0 bg-white bg-opacity-10 text-white rounded-5 shadow-lg">
                <div className="card-body p-4 p-xl-5 d-flex flex-column">
                  <div className="bg-success bg-opacity-25 rounded-4 d-inline-flex align-items-center justify-content-center p-3 mb-4">
                    <i className="bi bi-patch-check-fill fs-3" />
                  </div>
                  <h3 className="fw-bold mb-3">Recrutamento Automatizado</h3>
                  <p className="text-white-50 lh-lg mb-0">
                    Tecnologia avançada para identificar os melhores candidatos
                    e empresas automaticamente por meio de palavras-chave e
                    acelerando contratações.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 border-0 bg-white bg-opacity-10 text-white rounded-5 shadow-lg">
                <div className="card-body p-4 p-xl-5 d-flex flex-column">
                  <div className="bg-primary bg-opacity-25 rounded-4 d-inline-flex align-items-center justify-content-center p-3 mb-4">
                    <i className="bi bi-clipboard-heart-fill fs-3" />
                  </div>
                  <h3 className="fw-bold mb-3">Match's</h3>
                  <p className="text-white-50 lh-lg mb-0">
                    Ranking de compatibilidade por meio das palavras-chave para
                    decisões mais rápidas e eficientes.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 border-0 bg-white bg-opacity-10 text-white rounded-5 shadow-lg">
                <div className="card-body p-4 p-xl-5 d-flex flex-column">
                  <div className="bg-warning bg-opacity-25 rounded-4 d-inline-flex align-items-center justify-content-center p-3 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                      height={30}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    ></svg>
                    <i className="bi bi-person-bounding-box fs-4" />
                  </div>
                  <h3 className="fw-bold mb-3">Experiência Humanizada</h3>
                  <p className="text-white-50 lh-lg mb-0">
                    Feedback contínuo e acompanhamento próximo durante sua
                    jornada profissional.
                  </p>
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
