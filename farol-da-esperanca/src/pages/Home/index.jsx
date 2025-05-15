import "./home.css";
import primeiraImagem from "../../assets/img/refugiados/old-man-8030174_1280.jpg";
import segundaImagem from "../../assets/img/refugiados/woman-8499959_1280.jpg";
import terceiraImagem from "../../assets/img/refugiados/engineers-8499881_1280.jpg";

const Home = () => {
  
  return (
    <div className="container mt-5 container-md">
      <div id="carouselExampleCaptions" className="carousel slide">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={0}
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={1}
            aria-label="Slide 2"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={2}
            aria-label="Slide 3"
          />
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={primeiraImagem} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Oportunidades</h5>
              <p>
                Some representative placeholder content for the first slide.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={segundaImagem} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Second slide label</h5>
              <p>
                Some representative placeholder content for the second slide.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={terceiraImagem} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Third slide label</h5>
              <p>
                Some representative placeholder content for the third slide.
              </p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="area-dados mt-2">
        <div className="area-dados-numeros">
          <h2>200</h2>
          <p>Pessoas atendidas</p>
        </div>
        <div className="area-dados-numeros">
          <h2>200</h2>
          <p>Pessoas inseridas no mercado de trabalho</p>
        </div>
        <div className="area-dados-numeros">
          <h2>200</h2>
          <p>Empreendedores apoiados</p>
        </div>
        <div className="area-dados-numeros">
          <h2>200</h2>
          <p>Empregadores</p>
        </div>
      </div>
    </div>
  );
};
export default Home;
