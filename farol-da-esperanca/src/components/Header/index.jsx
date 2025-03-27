import "./header.css";
import logo from '../../assets/img/logo.png'
const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg  head">
      <div className="container-fluid">
        <img
          className="img-fluid"
          src={logo}
          width={337}
          height={118}
        />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav naveg">
            <a className="nav-link opc" href="index.html">
              HOME
            </a>
            <a className="nav-link opc" href="saude.html">
              SAÚDE
            </a>
            <a className="nav-link opc" href="educacao.html">
              EDUCAÇÃO
            </a>
            <a className="nav-link opc " href="emprego.html">
              EMPREGO
            </a>
            <a className="nav-link opc" href="sobre-nos.html">
              SOBRE NÓS
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Header;
