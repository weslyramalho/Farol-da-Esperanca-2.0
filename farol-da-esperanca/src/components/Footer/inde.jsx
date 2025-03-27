import "./footer.css"
import logo from '../../assets/img/logo.png'
const Footer =()=>{
    return(
        <div className="footer container-fluid">
  <div className="conteudo-footer">
    <div className="elemento1-footer">
      <a href="home.html">Home</a>
      <a href="saude.html">Saúde</a>
      <a href="educacao.html">Educação</a>
      <a href="emprego.html">Emprego</a>
      <a href="sobre-nos.html">Sobre Nós</a>
    </div>
    <img
      className="elemento2-footer"
      src={logo}
      alt="logo-footer"
    />
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


    )
}
export default Footer