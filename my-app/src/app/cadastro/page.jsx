"use client"

import { useEffect, useState } from 'react';

export default function CadastroEmpresa() {
  // Estado para armazenar os planos vindos do banco de dados
  const [planos, setPlanos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede a página de recarregar

    const formData = new FormData(e.target);

    try {
      // ⚠️ ATENÇÃO: Troque a porta 3333 para a porta real onde seu servidor Node.js/Express está rodando!
      const response = await fetch('http://localhost:3001/api/auth/cadastro/empresa', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = '/login'; 
      } else {
        // Isso vai transformar o objeto de erro do seu backend em texto na tela
        alert('Erro do Servidor: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Erro ao conectar com o servidor. O backend está rodando?');
    }
  };

  function executarCopiaPix() {
    const inputCode = document.getElementById('pix-copy-input');
    const btnText = document.getElementById('btn-copy-pix');

    inputCode.select();
    inputCode.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(inputCode.value);

    const textoOriginal = btnText.innerHTML;

    btnText.innerHTML = '<i class="bi bi-check-lg"></i> Copiado!';
    btnText.classList.replace('btn-dark', 'btn-success');

    setTimeout(() => {
      btnText.innerHTML = textoOriginal;
      btnText.classList.replace('btn-success', 'btn-dark');
    }, 2500);
  }

  // 1. Efeito para buscar os Planos na API assim que a página carregar
  useEffect(() => {
    // IMPORTANTE: Ajuste '/api/planos' para a rota exata do seu backend caso seja diferente
    fetch('http://localhost:3001/api/planos')
      .then((res) => res.json())
      .then((data) => {
        if (data.sucesso) {
          setPlanos(data.dados);
        }
      })
      .catch((err) => console.error("Erro ao buscar planos:", err));
  }, []);

  // 2. Efeito para o Resumo do Plano (Roda APENAS após os planos carregarem)
  useEffect(() => {
    if (planos.length === 0) return; // Aguarda os planos existirem na tela

    const inputsPlanos = document.querySelectorAll('input[name="planos_id"]');
    const labelPlanName = document.getElementById('summary-plan-name');
    const labelPlanPrice = document.getElementById('summary-plan-price');
    const labelTotalPrice = document.getElementById('summary-total-price');

    function recalcularResumo(valorPlano, nomePlano) {
      labelPlanName.innerText = nomePlano;
      const valorString = String(valorPlano); // Garante que seja string para usar o replace
      labelPlanPrice.innerText = `R$ ${valorString.replace('.', ',')}`;
      labelTotalPrice.innerText = `R$ ${valorString.replace('.', ',')}`;
    }

    inputsPlanos.forEach((radio) => {
      radio.addEventListener('change', function () {
        if (this.checked) {
          // Puxa o preço do data-preco em vez do value (já que o value agora é o ID pro Banco)
          recalcularResumo(this.getAttribute('data-preco'), this.getAttribute('data-nome'));
        }
      });
    });

    // Seta o primeiro plano como padrão no resumo visualmente
    recalcularResumo(planos[0].preco_mensal, planos[0].nome);
  }, [planos]);

  // 3. Efeito original para Máscaras, Métodos de Pagamento e Timer
  useEffect(() => {
    const radioMetodos = document.querySelectorAll('input[name="metodo_pagamento"]');

    const wrappers = {
      pix: document.getElementById('wrapper-pix'),
      cartao: document.getElementById('wrapper-cartao'),
      boleto: document.getElementById('wrapper-boleto')
    };

    radioMetodos.forEach((radio) => {
      radio.addEventListener('change', function () {
        Object.values(wrappers).forEach((el) => {
          el.classList.add('d-none');
        });

        if (this.checked && wrappers[this.value]) {
          wrappers[this.value].classList.remove('d-none');
        }
      });
    });

    function iniciarContagemRegressiva(duracaoSegundos, display) {
      let tempo = duracaoSegundos;

      const intervalo = setInterval(() => {
        let minutos = parseInt(tempo / 60, 10);
        let segundos = parseInt(tempo % 60, 10);

        minutos = minutos < 10 ? "0" + minutos : minutos;
        segundos = segundos < 10 ? "0" + segundos : segundos;

        display.textContent = minutos + ":" + segundos;

        if (--tempo < 0) {
          clearInterval(intervalo);
          display.textContent = "EXPIRADO";
          display.classList.replace('bg-danger', 'bg-secondary');
        }
      }, 1000);
    }

    iniciarContagemRegressiva(
      15 * 60,
      document.getElementById('pix-countdown')
    );

    const inputCard = document.getElementById('input-card-number');
    const inputExpiry = document.getElementById('input-card-expiry');
    const flagDefault = document.getElementById('flag-default');
    const flagDetected = document.getElementById('flag-detected');

    inputCard?.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = v;

      const puro = v.replace(/\s/g, '');

      if (puro.startsWith('4')) {
        flagDefault.classList.add('d-none');
        flagDetected.className = "badge bg-primary text-white d-inline-block";
        flagDetected.innerText = "Visa";
      } else if (/^(5[1-5]|2[2-7])/.test(puro)) {
        flagDefault.classList.add('d-none');
        flagDetected.className = "badge bg-warning text-dark d-inline-block";
        flagDetected.innerText = "Mastercard";
      } else {
        flagDefault.classList.remove('d-none');
        flagDetected.classList.add('d-none');
      }
    });

    inputExpiry?.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 2) {
        v = v.substring(0, 2) + '/' + v.substring(2, 4);
      }
      e.target.value = v;
    });

    document.getElementById('cnpj')?.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      e.target.value = value;
    });

    document.getElementById('telefone')?.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
      e.target.value = value;
    });

    document.getElementById('cep')?.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
      e.target.value = value;
    });

  }, []);

  return (
    <>
      {/* BLOCO DE CONTEÚDO 🚥 */}
      <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4">
        <div className="container-fluid pt-3 pb-5 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">
          <div
            className="p-4 p-md-5 shadow-lg text-white bg-dark-custom d-flex flex-column flex-grow-1"
            style={{
              backgroundImage: "linear-gradient(45deg, #162417 0%, #2a402c 100%)",
              borderRadius: 0,
              borderTopLeftRadius: 30
            }}
          >
            <div className="row align-items-center g-5 mb-5">
              <div className="tab-content" id="pills-tabContent">
                <div className="d-flex justify-content-center mb-5">
                  <ul className="nav nav-pills gap-3 custom-tabs" id="pills-tab" role="tablist">
                    {/* --- BOTÃO: SOU EMPRESA --- */}
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link active rounded-pill px-4 py-2 fs-5 btn-primeiro text-decoration-none"
                        href="/cadastro"
                      >
                        <i className="bi bi-building me-2" />
                        Sou Empresa
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link rounded-pill px-4 py-2 fs-5 btn-primeiro text-decoration-none"
                        href="/cadastroCliente"
                      >
                        <i className="bi bi-person-vcard me-2" />
                        Sou Candidato
                      </a>
                    </li>
                  </ul>
                </div>
                <div
                  className="tab-pane fade show active"
                  id="pills-empresa"
                  role="tabpanel"
                  aria-labelledby="pills-empresa-tab"
                >
                  <div className="row justify-content-center">
                    <div className="col-lg-9">
                      <div
                        className="p-4 p-md-5 text-dark-custom shadow-lg"
                        style={{ backgroundColor: "#9DC5BB", borderRadius: 24 }}
                      >
                        <div className="text-center mb-5">
                          <h2 className="fw-bold font-georgia mb-2 text-dark">
                            Cadastro Empresarial
                          </h2>
                          <p className="text-muted">
                            Preencha os dados da sua empresa para liberar o acesso à plataforma
                          </p>
                        </div>
                        <form
                          onSubmit={handleSubmit}
                          encType="multipart/form-data"
                          id="form-cadastro-empresa"
                        >
                          <h5 className="section-title mt-0 mb-3 border-bottom pb-2 text-dark fw-bold">
                            <i className="bi bi-shield-lock me-2 text-success" />
                            1. Informações de Acesso
                          </h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label fw-medium text-dark">E-mail Corporativo:</label>
                              <input
                                type="email"
                                name="email"
                                className="form-control form-control-custom bg-white"
                                placeholder="rh@empresa.com"
                                required=""
                                maxLength={180}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium text-dark">Senha do Sistema:</label>
                              <input
                                type="password"
                                name="senha"
                                className="form-control form-control-custom bg-white"
                                placeholder="Defina uma senha segura"
                                required=""
                              />
                            </div>
                          </div>
                          <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                            <i className="bi bi-building me-2 text-success" />
                            2. Dados Institucionais
                          </h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label fw-medium text-dark">Nome / Razão Social:</label>
                              <input
                                type="text"
                                name="nome"
                                className="form-control form-control-custom bg-white"
                                placeholder="Nome oficial da empresa"
                                required=""
                                maxLength={150}
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-medium text-dark">CNPJ:</label>
                              <input
                                type="text"
                                name="cnpj"
                                id="cnpj"
                                className="form-control form-control-custom bg-white"
                                placeholder="00.000.000/0000-00"
                                maxLength={18}
                                required=""
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-medium text-dark">Telefone:</label>
                              <input
                                type="text"
                                name="telefone"
                                id="telefone"
                                className="form-control form-control-custom bg-white"
                                placeholder="(00) 00000-0000"
                                maxLength={15}
                                required=""
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-medium text-dark">Logotipo ou Documento de Identificação:</label>
                              <input
                                type="file"
                                name="arquivo"
                                className="form-control form-control-custom bg-white"
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-medium text-dark">Descrição / Quem Somos:</label>
                              <textarea
                                name="descricao"
                                className="form-control form-control-custom bg-white"
                                rows={3}
                                placeholder="Conte um pouco sobre a cultura e segmento da empresa..."
                                defaultValue={""}
                              />
                            </div>
                          </div>
                          <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                            <i className="bi bi-geo-alt me-2 text-success" />
                            3. Endereço da Sede
                          </h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-3">
                              <label className="form-label fw-medium text-dark">CEP:</label>
                              <input
                                type="text"
                                name="cep"
                                id="cep"
                                className="form-control form-control-custom bg-white"
                                placeholder="00000-000"
                                maxLength={9}
                                required=""
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium text-dark">Rua/Logradouro:</label>
                              <input
                                type="text"
                                name="rua"
                                className="form-control form-control-custom bg-white"
                                placeholder="Ex: Av. Paulista"
                                required=""
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-medium text-dark">Número:</label>
                              <input
                                type="text"
                                name="numero"
                                className="form-control form-control-custom bg-white"
                                placeholder="123"
                                required=""
                              />
                            </div>
                            <div className="col-md-5">
                              <label className="form-label fw-medium text-dark">Bairro:</label>
                              <input
                                type="text"
                                name="bairro"
                                className="form-control form-control-custom bg-white"
                                placeholder="Bairro"
                                required=""
                              />
                            </div>
                            <div className="col-md-5">
                              <label className="form-label fw-medium text-dark">Cidade:</label>
                              <input
                                type="text"
                                name="cidade"
                                className="form-control form-control-custom bg-white"
                                placeholder="Cidade"
                                required=""
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label fw-medium text-dark">Estado (UF):</label>
                              <input
                                type="text"
                                name="estado"
                                className="form-control form-control-custom bg-white"
                                placeholder="UF"
                                maxLength={2}
                                required=""
                              />
                            </div>
                          </div>

                          <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                            <i className="bi bi-award me-2 text-success" />
                            4. Escolha o seu Plano Corporativo
                          </h5>

                          <div className="row g-3 mb-5">
                            {/* RENDERIZAÇÃO DINÂMICA DOS PLANOS VINDOS DO BANCO */}
                            {planos.length === 0 ? (
                              <div className="col-12 text-center text-muted">
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                Carregando planos corporativos...
                              </div>
                            ) : (
                              planos.map((plano, index) => (
                                <div className="col-md-4" key={plano.id}>
                                  <input
                                    type="radio"
                                    name="planos_id"
                                    id={`planos_${plano.id}`}
                                    defaultValue={plano.id} // Agora envia o ID pro banco
                                    data-preco={plano.preco_mensal} // Guarda o preço para o resumo
                                    data-nome={plano.nome}
                                    className="planos-input d-none"
                                    defaultChecked={index === 0}
                                    required=""
                                  />
                                  <label
                                    className="planos-card p-4 h-100 w-100 text-center d-flex flex-column justify-content-between rounded-4 shadow-sm bg-white border cursor-pointer position-relative"
                                    htmlFor={`planos_${plano.id}`}
                                  >
                                    <div>
                                      <h5 className="fw-bold mb-1 text-dark">{plano.nome}</h5>
                                      <span className="d-block mb-3 text-muted small">
                                        Até {plano.limite_funcionarios} funcionários
                                      </span>
                                    </div>
                                    <div className="fw-bold fs-4 my-2 text-success">
                                      R$ {String(plano.preco_mensal).replace('.', ',')}
                                      <span className="fs-6 fw-normal text-muted"> /mês</span>
                                    </div>
                                  </label>
                                </div>
                              ))
                            )}
                          </div>

                          <h5 className="section-title mb-3 border-bottom pb-2 text-dark fw-bold">
                            <i className="bi bi-credit-card me-2 text-success" />
                            5. Detalhes do Pagamento
                          </h5>
                          <div className="row g-4">
                            <div className="col-lg-7">
                              <div className="d-flex gap-2 mb-3 bg-white p-1 rounded-3 border">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="metodo_pagamento"
                                  id="pay_pix"
                                  defaultValue="pix"
                                  defaultChecked=""
                                />
                                <label className="btn btn-payment-tab flex-grow-1 py-2 text-nowrap" htmlFor="pay_pix">
                                  <i className="bi bi-qr-code-scan me-1" /> PIX
                                </label>
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="metodo_pagamento"
                                  id="pay_card"
                                  defaultValue="cartao"
                                />
                                <label className="btn btn-payment-tab flex-grow-1 py-2 text-nowrap" htmlFor="pay_card">
                                  <i className="bi bi-credit-card-2-back me-1" /> Cartão
                                </label>
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="metodo_pagamento"
                                  id="pay_boleto"
                                  defaultValue="boleto"
                                />
                                <label className="btn btn-payment-tab flex-grow-1 py-2 text-nowrap" htmlFor="pay_boleto">
                                  <i className="bi bi-receipt me-1" /> Boleto
                                </label>
                              </div>
                              <div className="p-4 bg-white rounded-4 border shadow-sm text-dark min-height-payment">
                                <div id="wrapper-pix" className="payment-method-container text-center text-md-start">
                                  <div className="row align-items-center g-3">
                                    <div className="col-md-5 text-center">
                                      <div className="position-relative d-inline-block p-3 bg-white border border-2 rounded-4 shadow-sm">
                                        <svg className="mx-auto display-block" xmlns="http://www.w3.org/2000/svg" width={130} height={130} viewBox="0 0 29 29" style={{ color: "#000" }}>
                                          <path fill="currentColor" d="M0 0h7v7H0zm1 1v5h5V1zm8 0h1v1H9zm1 1h1v2h-1zm2 1h1v1h-1zm-3 1h1v1H9zm3 0h1v2h-1zm-2 2h1v1h-1zm5-5h7v7h-7zm1 1v5h5V1zm-6 8h1v1H9zm2 0h1v2h-1zm4 0h2v1h-2zm3 0h1v1h-1zm2 0h3v1h-3zm-9 1h1v3H9zm6 0h1v1h-1zm2 0h1v1h-1zm-5 1h2v1h-2zm3 0h1v2h-1zm4 0h1v1h-1zm1 0h1v3h-1zm-7 1h1v1h-1zm2 0h1v1h-1zm-11 2h7v7H0zm1 1v5h5V14zm11 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h2v1h-2zm-8 1h1v1h-1zm2 0h1v2h-1zm3 0h1v1h-1zm2 0h1v2h-1zm-6 1h1v3H9zm4 0h1v1h-1zm3 0h2v1h-2zm-7 1h1v1H9zm4 0h2v1h-2zm3 0h1v2h-1zm2 0h1v1h-1zm-9 1h1v1H9zm4 0h1v1h-1zm2 0h3v1h-3z" />
                                        </svg>
                                        <span className="position-absolute top-100 start-50 translate-middle badge bg-danger rounded-pill shadow" id="pix-countdown">
                                          15:00
                                        </span>
                                      </div>
                                      <small className="d-block text-muted mt-3">Aguardando pagamento...</small>
                                    </div>
                                    <div className="col-md-7">
                                      <h6 className="fw-bold mb-1 text-dark">
                                        <i className="bi bi-lightning-charge-fill text-warning me-1" /> Desconto &amp; Ativação Instantânea
                                      </h6>
                                      <p className="small text-muted mb-3">
                                        Pague via PIX e tenha o sistema liberado imediatamente na sua conta corporativa.
                                      </p>
                                      <label className="form-label small fw-bold text-secondary mb-1">Copia e Cola:</label>
                                      <div className="input-group">
                                        <input
                                          type="text"
                                          id="pix-copy-input"
                                          className="form-control form-control-sm bg-light text-truncate border-end-0"
                                          readOnly=""
                                          defaultValue="00020126580014br.gov.bcb.pix013697a8e52c-87d4-4b53-a812-70b134988f01520400005303986540559.995802BR5925SuaEmpresaTecnologia6009SaoPaulo62070503***6304A1B2"
                                        />
                                        <button className="btn btn-dark btn-sm px-3 fw-bold" type="button" id="btn-copy-pix" onClick={executarCopiaPix}>
                                          <i className="bi bi-clipboard me-1" /> Copiar
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div id="wrapper-cartao" className="payment-method-container d-none">
                                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                                    <h6 className="fw-bold m-0">
                                      <i className="bi bi-credit-card-2-front me-1" /> Crédito à Vista ou Parcelado
                                    </h6>
                                    <div className="fs-4 text-muted d-flex gap-2" id="card-flags-preview">
                                      <i className="bi bi-credit-card" id="flag-default" />
                                      <span id="flag-detected" className="badge bg-dark fs-6 d-none" />
                                    </div>
                                  </div>
                                  <div className="row g-2">
                                    <div className="col-md-12">
                                      <label className="form-label small fw-medium text-muted mb-1">Número do Cartão:</label>
                                      <input type="text" id="input-card-number" className="form-control form-control-sm" placeholder="0000 0000 0000 0000" maxLength={19} />
                                    </div>
                                    <div className="col-md-12">
                                      <label className="form-label small fw-medium text-muted mb-1">Nome Impresso:</label>
                                      <input type="text" className="form-control form-control-sm" placeholder="Ex: JOAO O SILVA" style={{ textTransform: "uppercase" }} />
                                    </div>
                                    <div className="col-md-6">
                                      <label className="form-label small fw-medium text-muted mb-1">Validade:</label>
                                      <input type="text" id="input-card-expiry" className="form-control form-control-sm" placeholder="MM/AA" maxLength={5} />
                                    </div>
                                    <div className="col-md-6">
                                      <label className="form-label small fw-medium text-muted mb-1">Código CVV:</label>
                                      <input type="text" className="form-control form-control-sm" placeholder="123" maxLength={4} />
                                    </div>
                                  </div>
                                </div>
                                <div id="wrapper-boleto" className="payment-method-container d-none">
                                  <div className="text-center py-2">
                                    <div className="d-inline-flex p-3 bg-light rounded-circle mb-2 text-secondary">
                                      <i className="bi bi-upc-scan fs-3" />
                                    </div>
                                    <h6 className="fw-bold mb-1">Faturamento via Boleto Bancário</h6>
                                    <p className="small text-muted mb-3 mx-auto" style={{ maxWidth: 380 }}>
                                      Vencimento em 3 dias. A liberação ocorre em até **48h úteis** após o pagamento.
                                    </p>
                                    <div className="p-2 bg-light rounded border text-monospace small text-truncate position-relative px-4 mb-2">
                                      34191.79001 01043.513184 91020.150008 7 98310000005999
                                    </div>
                                    <span className="text-muted text-center d-block style-obs">
                                      *O boleto em PDF será enviado ao e-mail de acesso.
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-5">
                              <div className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between border shadow-sm" style={{ backgroundColor: "rgba(255,255,255,0.45)" }}>
                                <div>
                                  <h6 className="fw-bold border-bottom pb-2 text-dark">
                                    <i className="bi bi-cart3 me-1" /> Resumo da Contratação
                                  </h6>
                                  <div className="d-flex justify-content-between my-2 text-dark">
                                    <span id="summary-plan-name">Plano Básico</span>
                                    <span className="fw-bold" id="summary-plan-price">R$ 59,99</span>
                                  </div>
                                  <div className="d-flex justify-content-between small text-muted my-1">
                                    <span>Taxa de adesão</span>
                                    <span className="text-success fw-bold">Grátis</span>
                                  </div>
                                  <div className="d-flex justify-content-between small text-muted my-1">
                                    <span>Cobrança</span>
                                    <span>Mensal Recorrente</span>
                                  </div>
                                </div>
                                <div className="pt-3 border-top mt-4">
                                  <div className="d-flex justify-content-between align-items-baseline mb-3 text-dark">
                                    <span className="fw-bold">Total a Pagar:</span>
                                    <span className="fs-3 fw-extrabold text-success font-monospace" id="summary-total-price">
                                      R$ 59,99
                                    </span>
                                  </div>
                                  <button type="submit" className="btn btn-primeiro w-100 rounded-pill py-3 fw-bold shadow transition-all d-flex align-items-center justify-content-center gap-2">
                                    <i className="bi bi-shield-check fs-5" /> Finalizar E Ativar Conta
                                  </button>
                                  <div className="text-center mt-2">
                                    <small className="text-muted style-obs">
                                      <i className="bi bi-lock-fill" /> Checkout 100% Criptografado
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
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