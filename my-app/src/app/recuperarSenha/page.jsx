export default function recuperarSenha(){
    return(
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
      <div className="row w-100 justify-content-center mx-0">
        <div className="col-12 px-0">
          <div className="tab-content" id="pills-tabContent-login">
            <div
              className="tab-pane fade show active"
              id="pills-login-empresa"
              role="tabpanel"
              aria-labelledby="pills-login-empresa-tab"
            >
              <div className="p-4 p-md-5 text-dark shadow-lg login-card cor-fundo">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i
                      className="bi bi-key-fill"
                      style={{ fontSize: "3.5rem", color: "#162417" }}
                    />
                  </div>
                  <h2
                    className="fw-bold font-georgia mb-2"
                    style={{ color: "#162417" }}
                  >
                    Esqueceu sua senha?
                  </h2>
                  <p className="text-dark opacity-75 small">
                    Mude sua senha através do email.
                  </p>
                </div>
                <form action="/login" method="POST">
                  <input
                    type="hidden"
                    name="tipo_usuario"
                    defaultValue="empresa"
                  />
                  <div className="mb-3">
                    <label
                      className="form-label fw-medium"
                      style={{ color: "#162417" }}
                    >
                      <i className="bi bi-envelope me-2" />
                      Informe seu Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control form-control-custom"
                      placeholder="Digite seu e-mail"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      className="form-label fw-medium"
                      style={{ color: "#162417" }}
                    >
                      <p>
                        Você receberá através do email um formulário para a
                        mudança de senha.
                      </p>
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn-primeiro rounded-5 w-100 fs-5 py-2 mb-4"
                    onclick="mostrarMensagem()"
                  >
                    Recuperar Senha
                  </button>
                  <div className="text-center mt-2 border-top border-dark border-opacity-10 pt-4">
                    <p className="mb-0 text-dark small">
                      Sua empresa ainda não tem conta? <br />
                      <a
                        href="CadastrarCandidato.html"
                        className="link-custom mt-1 d-inline-block"
                      >
                        <i className="bi bi-box-arrow-in-right me-1" />
                        Cadastre-se aqui
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>{" "}
    </div>
  </div>{" "}
</main>

        </>
    )
}