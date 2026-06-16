"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PagamentoCurso() {
  const params = useParams();
  const router = useRouter();
  const idCurso = params?.id;

  const [curso, setCurso] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("cartao");

  const [nomeCartao, setNomeCartao] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (idCurso) {
      buscarDetalhesCurso();
    }
  }, [idCurso]);

  async function buscarDetalhesCurso() {
    try {
      const response = await fetch(
        `http://localhost:3001/api/cursos/${idCurso}`
      );
      const data = await response.json();

      if (data.sucesso) {
        setCurso(data.dados);
      } else {
        alert("Curso não encontrado.");
        router.push("/cursos");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do curso:", error);
      alert("Erro ao carregar curso.");
    } finally {
      setCarregando(false);
    }
  }

  function copiarTexto(texto) {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  async function finalizarPagamento(e) {
    e.preventDefault();
    setProcessando(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        formaPagamento: formaPagamento,
      };

      if (formaPagamento === "cartao") {
        payload.dadosCartao = { nomeCartao, numeroCartao, validade, cvv };
      }

      const response = await fetch(
        `http://localhost:3001/api/cursos/${idCurso}/comprar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      alert(
        data.mensagem ||
        data.erro ||
        "Erro ao processar pagamento"
      );

      if (data.sucesso) {
        router.push("/cursos");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Houve um erro ao processar o pagamento.");
    } finally {
      setProcessando(false);
    }
  }

  if (carregando) {
    return (
      <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </main>
    );
  }

  if (!curso) {
    return null;
  }

  return (
    <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4">
      <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
        <div
          className="p-4 p-md-5 shadow-lg text-white cor-main d-flex flex-column flex-grow-1"
          style={{ borderRadius: "0", borderTopLeftRadius: "30px" }}
        >
          <h1 className="display-3 fw-bolder mb-4 lh-sm">
            Finalizar
            <br />
            <span className="text-success">Pagamento!</span>
          </h1>

          <div className="row g-4 justify-content-center flex-grow-1">
            <div className="col-12 col-lg-5">
              <div className="card h-100 shadow rounded-4" style={{ backgroundColor: "#9DC5BB" }}>
                <div className="card-body p-4 d-flex flex-column text-dark">
                  <span className="badge bg-dark bg-opacity-10 text-dark align-self-start mb-3 px-3 py-2 rounded-pill fw-semibold">
                    Curso {curso?.id}
                  </span>
                  <h5 className="card-title fw-bold mb-3">{curso?.titulo}</h5>
                  <p className="mb-4">{curso?.descricao}</p>

                  <div className="mt-auto pt-3 border-top border-dark border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Total:</span>
                      <h3 className="fw-bold mb-0">R$ {Number(curso?.valor).toFixed(2)}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="card h-100 shadow rounded-4 bg-white text-dark">
                <div className="card-body p-4 d-flex flex-column">
                  <h5 className="fw-bold mb-3 text-uppercase tracking-wide text-secondary" style={{ fontSize: "0.85rem" }}>
                    Escolha a forma de pagamento
                  </h5>
                  <div className="row g-2 mb-4">
                    <div className="col-4">
                      <button
                        type="button"
                        className={`btn w-100 py-2 rounded-3 fw-semibold ${formaPagamento === "cartao" ? "btn-success" : "btn-outline-secondary"}`}
                        onClick={() => setFormaPagamento("cartao")}
                      >
                        💳 <span className="d-none d-md-inline">Cartão</span>
                      </button>
                    </div>
                    <div className="col-4">
                      <button
                        type="button"
                        className={`btn w-100 py-2 rounded-3 fw-semibold ${formaPagamento === "pix" ? "btn-success" : "btn-outline-secondary"}`}
                        onClick={() => setFormaPagamento("pix")}
                      >
                        📱 <span className="d-none d-md-inline">Pix</span>
                      </button>
                    </div>
                    <div className="col-4">
                      <button
                        type="button"
                        className={`btn w-100 py-2 rounded-3 fw-semibold ${formaPagamento === "boleto" ? "btn-success" : "btn-outline-secondary"}`}
                        onClick={() => setFormaPagamento("boleto")}
                      >
                        📄 <span className="d-none d-md-inline">Boleto</span>
                      </button>
                    </div>
                  </div>

                  <hr className="mb-4 opacity-25" />
                  <form onSubmit={finalizarPagamento} className="d-flex flex-column flex-grow-1">
                    {formaPagamento === "cartao" && (
                      <div className="animation-fade">
                        <div className="mb-3">
                          <label className="form-label fw-semibold small">Nome Impresso no Cartão</label>
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-3"
                            placeholder="Ex: JOÃO S SILVA"
                            required={formaPagamento === "cartao"}
                            value={nomeCartao}
                            onChange={(e) => setNomeCartao(e.target.value.toUpperCase())}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold small">Número do Cartão</label>
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-3"
                            placeholder="0000 0000 0000 0000"
                            maxLength="16"
                            required={formaPagamento === "cartao"}
                            value={numeroCartao}
                            onChange={(e) => setNumeroCartao(e.target.value.replace(/\D/g, ""))}
                          />
                        </div>
                        <div className="row g-3 mb-4">
                          <div className="col-6">
                            <label className="form-label fw-semibold small">Validade</label>
                            <input
                              type="text"
                              className="form-control form-control-lg rounded-3"
                              placeholder="MM/AA"
                              maxLength="5"
                              required={formaPagamento === "cartao"}
                              value={validade}
                              onChange={(e) => setValidade(e.target.value)}
                            />
                          </div>
                          <div className="col-6">
                            <label className="form-label fw-semibold small">CVV</label>
                            <input
                              type="text"
                              className="form-control form-control-lg rounded-3"
                              placeholder="123"
                              maxLength="3"
                              required={formaPagamento === "cartao"}
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {formaPagamento === "pix" && (
                      <div className="text-center py-2 animation-fade">
                        <div className="bg-light p-3 rounded-4 d-inline-block mb-3 shadow-sm">
                          <div style={{ width: "150px", height: "150px", backgroundColor: "#333", margin: "0 auto" }} className="rounded-3 d-flex align-items-center justify-content-center text-white small">
                            [ QR CODE PIX ]
                          </div>
                        </div>
                        <p className="small text-muted mb-3 px-3">
                          Aprovação imediata! Escaneie o QR Code acima ou copie a chave copia e cola abaixo para pagar no seu banco.
                        </p>
                        <div className="input-group mb-4">
                          <input
                            type="text"
                            className="form-control rounded-start-3 bg-light"
                            readOnly
                            value="00020101021126580014br.gov.bcb.pix0136e3b..."
                          />
                          <button
                            className="btn btn-dark rounded-end-3"
                            type="button"
                            onClick={() => copiarTexto("00020101021126580014br.gov.bcb.pix0136e3b...")}
                          >
                            {copiado ? "Copiado!" : "Copiar"}
                          </button>
                        </div>
                      </div>
                    )}
                    {formaPagamento === "boleto" && (
                      <div className="py-2 animation-fade">
                        <div className="alert alert-secondary rounded-3 text-dark small mb-3">
                          📌 <strong>Atenção:</strong> Boletos levam de 1 a 2 dias úteis para compensação bancária. O curso será liberado após a confirmação.
                        </div>
                        <p className="fw-semibold small mb-2">Código de barras do boleto:</p>
                        <div className="input-group mb-4">
                          <input
                            type="text"
                            className="form-control rounded-start-3 bg-light small"
                            readOnly
                            value="34191.79001 01043.513184 91020.150008 7 900000000"
                          />
                          <button
                            className="btn btn-dark rounded-end-3"
                            type="button"
                            onClick={() => copiarTexto("34191.79001 01043.513184 91020.150008 7 900000000")}
                          >
                            {copiado ? "Copiado!" : "Copiar"}
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="mt-auto d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-dark px-4"
                        onClick={() => router.push("/cursos")}
                        disabled={processando}
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success flex-fill py-2 fw-bold shadow-sm text-uppercase"
                        disabled={processando}
                      >
                        {processando
                          ? "Processando..."
                          : formaPagamento === "cartao"
                          ? "Confirmar Inscrição"
                          : formaPagamento === "pix"
                          ? "Concluir com Pix"
                          : "Gerar Boleto Bancário"}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}