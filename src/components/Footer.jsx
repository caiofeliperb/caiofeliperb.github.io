import React from 'react';
import './Footer.css';

// Using the same strategy as App.jsx
import logoLight from '../assets/uern_logo_azul.png';
import logoDark from '../assets/uern_logo_branca.png';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container footer-content">
                <div className="footer-logo">
                    <img src={logoLight} alt="Logotipo UERN" className="logo-img logo-light" />
                    <img src={logoDark} alt="Logotipo UERN" className="logo-img logo-dark" />
                </div>
                <div className="footer-credits">
                    <p className="copyright">© 2026 Universidade do Estado do Rio Grande do Norte (UERN). Todos os direitos reservados.</p>
                    <p className="project-title">Projeto de Pesquisa: Impacto da Implantação do Curso de Medicina da Universidade do Estado do Rio Grande do Norte nos Municípios da Mesorregião Oeste Potiguar.</p>
                    <p className="researchers">
                        Idealização, Pesquisa e Desenvolvimento: Caio Felipe Rodrigues Barbosa, Denise Rocha Dias da Silveira, Maria Eduarda Varela Cavalcanti Souto, Thales Allyrio Araújo de Medeiros Fernandes, Alícia Eliege da Silva, Milena Sonely Mendonça Bezerra Lima.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
