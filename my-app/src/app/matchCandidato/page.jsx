"use client";

import { useEffect, useState } from "react";

export default function MatchCandidatoPage() {
    const [matches, setMatches] = useState([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [animacao, setAnimacao] = useState("");

    useEffect(() => {
        async function carregarMatches() {
            try {
                const token = localStorage.getItem("token");

                console.log("TOKEN:", localStorage.getItem("token"));

                const response = await fetch(
                    "http://localhost:3001/api/matches/candidato",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao carregar matches");
                }

                const dados = await response.json();
                setMatches(dados);
            } catch (erro) {
                console.error(erro);
            } finally {
                setLoading(false);
            }
        }

        carregarMatches();
    }, []);

    const matchAtual = matches[indiceAtual];

    const realizarSwipe = (direcao) => {
        setAnimacao(
            direcao === "esquerda"
                ? "swipe-left-out"
                : "swipe-right-out"
        );

        setTimeout(() => {
            setIndiceAtual((prev) => prev + 1);
            setAnimacao("card-enter");

            setTimeout(() => {
                setAnimacao("");
            }, 400);
        }, 500);
    };

    const dispensar = () => {
        realizarSwipe("esquerda");
    };

    const candidatar = async () => {
        try {
            const token = localStorage.getItem("token");

            if (matchAtual?.id) {
                await fetch("http://localhost:3001/api/candidaturas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        vaga_id: matchAtual.id,
                    }),
                });
            }

            realizarSwipe("direita");
        } catch (erro) {
            console.error(erro);
            alert("Erro ao realizar candidatura.");
        }
    };

    if (loading) {
        return (
            <main className="container py-5 text-center">
                <h3>Carregando matches...</h3>
            </main>
        );
    }

    return (
        <>
            <style jsx>{`
        .card-enter {
          animation: cardEnter 0.4s ease;
        }

        .swipe-left-out {
          animation: swipeLeft 0.5s ease forwards;
        }

        .swipe-right-out {
          animation: swipeRight 0.5s ease forwards;
        }

        .match-pulse {
          animation: pulse 2s infinite;
        }

        .avatar-match {
          width: 90px;
          height: 90px;
          background: white;
        }

        .match-connector {
          position: absolute;
          top: 45px;
          left: 20%;
          width: 60%;
          height: 4px;
          background: linear-gradient(
            90deg,
            #20c997,
            #198754
          );
          z-index: 0;
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: scale(0.9);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes swipeLeft {
          to {
            opacity: 0;
            transform: translateX(-150%) rotate(-15deg);
          }
        }

        @keyframes swipeRight {
          to {
            opacity: 0;
            transform: translateX(150%) rotate(15deg);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.6);
          }

          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(25, 135, 84, 0);
          }

          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(25, 135, 84, 0);
          }
        }
      `}</style>

            <main
                id="main-content"
                className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4"
            >
                <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
                    <div
                        className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1"
                        style={{
                            backgroundImage:
                                "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
                            borderRadius: 0,
                            borderTopLeftRadius: 30,
                        }}
                    >
                        <div className="row w-100 mx-0">
                            <div className="col-12 px-0">
                                <div className="mb-5 text-center mt-2">
                                    <h1 className="font-georgia fw-bold text-white mb-2">
                                        ✨ Novo Match Encontrado!
                                    </h1>

                                    <p className="text-white-50 fs-5">
                                        Vocês têm muito em comum. Veja os detalhes abaixo.
                                    </p>

                                    <div className="row justify-content-center mb-5">
                                        <div className="col-md-10 col-lg-8 col-xl-7">
                                            {matchAtual ? (
                                                <div
                                                    className={`card border-0 rounded-4 shadow-lg mb-4 ${animacao}`}
                                                >
                                                    <div className="card-body p-4 p-md-5">
                                                        <div className="position-relative d-flex justify-content-between align-items-start mb-5 pt-2">
                                                            <div className="match-connector d-none d-sm-block" />

                                                            <div
                                                                className="d-flex flex-column align-items-center text-center"
                                                                style={{ width: "30%" }}
                                                            >
                                                                <div className="avatar-match rounded-circle shadow-sm d-flex align-items-center justify-content-center border border-3 border-light mb-2">
                                                                    <i
                                                                        className={`bi ${matchAtual.icone ||
                                                                            "bi-building"
                                                                            } fs-2 text-dark`}
                                                                    />
                                                                </div>

                                                                <h5 className="fw-bold text-dark mb-0">
                                                                    {matchAtual.empresa}
                                                                </h5>

                                                                <span className="badge bg-light text-dark border mt-2">
                                                                    Vaga: {matchAtual.vaga}
                                                                </span>
                                                            </div>

                                                            <div
                                                                className="d-flex flex-column align-items-center"
                                                                style={{
                                                                    width: "30%",
                                                                }}
                                                            >
                                                                <div
                                                                    className="rounded-circle match-pulse d-flex align-items-center justify-content-center text-white fw-bold shadow-lg"
                                                                    style={{
                                                                        width: 90,
                                                                        height: 90,
                                                                        background:
                                                                            "linear-gradient(135deg,#198754,#20c997)",
                                                                        border:
                                                                            "4px solid white",
                                                                        fontSize: "1.8rem",
                                                                    }}
                                                                >
                                                                    {matchAtual.percentual}%
                                                                </div>

                                                                <span className="text-success fw-bold mt-2 fs-5">
                                                                    Match!
                                                                </span>
                                                            </div>

                                                            <div
                                                                className="d-flex flex-column align-items-center text-center"
                                                                style={{ width: "30%" }}
                                                            >
                                                                <div className="avatar-match rounded-circle shadow-sm d-flex align-items-center justify-content-center border border-3 border-light mb-2">
                                                                    <i className="bi bi-person-circle fs-1 text-secondary" />
                                                                </div>

                                                                <h5 className="fw-bold text-dark mb-0">
                                                                    Você
                                                                </h5>

                                                                <span className="badge bg-light text-dark border mt-2">
                                                                    Seu Perfil
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="p-4 rounded-4 mb-4 shadow-sm border">
                                                            <h6 className="fw-bold text-center mb-3 text-success">
                                                                <i className="bi bi-lightning-charge-fill me-1" />
                                                                O que conectou vocês?
                                                            </h6>

                                                            <div className="row g-3 text-center">
                                                                {matchAtual.habilidades?.map(
                                                                    (item, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="col-6 col-md-4"
                                                                        >
                                                                            <div className="p-2 bg-white rounded-3 shadow-sm">
                                                                                <span className="fw-bold text-dark small">
                                                                                    {item}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                                                            <button
                                                                onClick={dispensar}
                                                                className="btn btn-light border rounded-pill fw-bold py-3 flex-fill text-danger"
                                                            >
                                                                <i className="bi bi-x-circle-fill me-2" />
                                                                Dispensar
                                                            </button>

                                                            <button
                                                                onClick={candidatar}
                                                                className="btn rounded-pill fw-bold py-3 flex-fill text-white"
                                                                style={{
                                                                    background:
                                                                        "linear-gradient(45deg,#162417,#2a402c)",
                                                                }}
                                                            >
                                                                <i className="bi bi-check-circle-fill me-2" />
                                                                Quero me Candidatar!
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                            ) : (
                                                <div className="text-center" style={{ paddingTop: '200px', paddingBottom: '200px' }}>
                                                    <h3 className="text-white fw-bold mb-3"> {/* mb-3 afasta um pouco o título do texto de baixo */}
                                                        <i className="bi bi-emoji-sunglasses me-2"></i>
                                                        Você zerou os Matches de hoje!
                                                    </h3>

                                                    <p className="text-white-50">
                                                        Volte amanhã para novas oportunidades.
                                                    </p>
                                                </div>
                                            )}
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