export default function Footer(){
    <>
    <footer id="footer" className="mt-auto py-5 cor-fundo shadow-lg">
  <div className="container-fluid px-4 text-center text-md-start">
    <div className="row g-4">
      <div className="col-md-4">
        <h5 className="fw-bold texto-escuro">MatchHire</h5>
        <p className="small text-muted">
          O match perfeito entre carreira e empresa.
        </p>
      </div>
      <div className="col-md-4">
        <h5 className="fw-bold texto-escuro">Políticas</h5>
        <a
          href="arquivos/politica.html"
          className="text-decoration-none text-dark d-block small mb-1"
        >
          Política de Privacidade
        </a>
        <a
          href="arquivos/Termos.html"
          className="text-decoration-none text-dark d-block small mb-1"
        >
          Termos de uso
        </a>
        <a href="#" className="text-decoration-none text-dark d-block small">
          Política de Cookies
        </a>
      </div>
      <div className="col-md-4">
        <h5 className="fw-bold texto-escuro">Notificações</h5>
        <h6 className="text-dark d-block small mb-2">
          Para mais informações sobre atualizações no sistema, adicione seu
          email abaixo.
        </h6>
        <div className="input-group input-group-sm shadow-sm rounded">
          <input
            type="email"
            className="form-control border-0"
            placeholder="Seu e-mail"
          />
          <button className="btn" style={{ backgroundColor: "#17B890" }}>
            Ok
          </button>
        </div>
      </div>
    </div>
  </div>
</footer>
    </>
}