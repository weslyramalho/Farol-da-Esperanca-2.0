import "./footer.css";
import logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer container-fluid">
      <div className="conteudo-footer">
        <div className="elemento1-footer">
          <Link to="/" className="nav-link opc">
            HOME
          </Link>

          <Link to="/oportunidades" className="nav-link opc">
            OPORTUNIDADES
          </Link>

          <Link to="/recursoseapoio" className="nav-link opc">
            RECURSOS E APOIO
          </Link>

          <Link to="/historiasdesucesso" className="nav-link opc ">
            HISTÓRIAS DE SUCESSO
          </Link>

          <Link to="/sobrenos" className="nav-link opc">
            SOBRE NÓS
          </Link>
        </div>
        <img className="elemento2-footer" src={logo} alt="logo-footer" />
        <div className="elemento3-footer">
          <a href="#">Email: faroldaesperanca@gmail.com</a>
          <a href="tel:+">Telefone: (99) 9 9999-9999</a>
          <a
            href="https://www.instagram.com/farol_da_esperanca?igsh=MTJqanIxOWx5enJxZA=="
            target="blank"
          >
            Instagram: _faroldaesperanca
          </a>
          <a href="#" target="blank">
            Facebook: _faroldaesperanca
          </a>
        </div>
      </div>
    </div>
  );
};
export default Footer;
