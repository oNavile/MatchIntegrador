import React from 'react';

export default function MeuPerfil() {
    return (
        <main id="main-content" className="flex-grow-1 d-flex flex-column pt-5 mt-5 mt-md-4">
            <div className="container-fluid pt-3 pb-0 pe-0 ps-3 ps-md-4 d-flex flex-column flex-grow-1">

                <div 
                    className="p-4 p-md-5 shadow-lg text-white d-flex flex-column flex-grow-1" 
                    style={{ 
                        backgroundImage: 'linear-gradient(45deg, #162417 0%, #2a402c 100%)',
                        borderRadius: 0,
                        borderTopLeftRadius: '30px' 
                    }}
                >

                    <div className="text-center mb-5">
                        <h1 className="font-georgia fw-bold">
                            Meu Perfil
                        </h1>

                        <p className="text-white-50 fs-5">
                            Mantenha suas informações atualizadas para aumentar seus matches.
                        </p>
                    </div>

                    <div className="row justify-content-center">

                        <div className="col-lg-10">
                            <div className="card border-0 rounded-4 shadow-lg mb-4" style={{ backgroundColor: 'var(--cor-fundo)' }}>

                                <div className="card-body p-4 p-md-5">

                                    <div className="row align-items-center">

                                        <div className="col-lg-3 text-center">

                                            <div 
                                                className="rounded-circle mx-auto shadow" 
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    background: '#e9ecef',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <i className="bi bi-person-fill fs-1 text-secondary"></i>
                                            </div>

                                        </div>

                                        <div className="col-lg-6">

                                            <h2 className="fw-bold text-dark">
                                                Sarah Vilarin
                                            </h2>

                                            <p className="text-muted mb-2">
                                                Desenvolvedora Front-End
                                            </p>

                                            <p className="mb-1">
                                                <i className="bi bi-geo-alt"></i>
                                                São Paulo - SP
                                            </p>

                                            <p className="mb-1">
                                                <i className="bi bi-envelope"></i>
                                                sarah@email.com
                                            </p>

                                            <p>
                                                <i className="bi bi-telephone"></i>
                                                (11) 99999-9999
                                            </p>

                                        </div>

                                        <div className="col-lg-3 text-center">

                                            <a href="EditarPerfil.html" className="btn btn-primeiro rounded-pill px-4">
                                                <i className="bi bi-pencil-square me-2"></i>
                                                Editar Perfil
                                            </a>
                                        </div>

                                    </div>

                                </div>

                            </div>
                            

                            <div className="card border-0 rounded-4 shadow mb-4">
                                <div className="card-body p-4">

                                    <h4 className="fw-bold mb-3 text-base-escuro">
                                        <i className="bi bi-person-lines-fill me-2"></i>
                                        Sobre Mim
                                    </h4>

                                    <p className="text-muted mb-0">
                                        Desenvolvedora Front-End com experiência em HTML,
                                        CSS, JavaScript, Bootstrap e React.
                                        Apaixonada por criar interfaces modernas,
                                        acessíveis e responsivas.
                                    </p>

                                </div>
                            </div>
                            <div className="card border-0 rounded-4 shadow mb-4">
                                <div className="card-body p-4">

                                    <h4 className="fw-bold mb-3 text-base-escuro">
                                        <i className="bi bi-stars me-2"></i>
                                        Competências
                                    </h4>

                                    <span className="badge bg-success me-2 mb-2">HTML</span>
                                    <span className="badge bg-success me-2 mb-2">CSS</span>
                                    <span className="badge bg-success me-2 mb-2">JavaScript</span>
                                    <span className="badge bg-success me-2 mb-2">Bootstrap</span>
                                    <span className="badge bg-success me-2 mb-2">React</span>
                                    <span className="badge bg-success me-2 mb-2">Git</span>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </main>
    );
}