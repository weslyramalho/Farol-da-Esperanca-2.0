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

      <section className="home-info-section mt-5">
        <article className="info-block mb-5">
          <h2>O Problema e Nossa Solução</h2>
          <p>
            O projeto busca solucionar a falta de oportunidades e o isolamento social enfrentados por refugiados no Brasil, causado por barreiras linguísticas, diferenças culturais, falta de reconhecimento profissional e preconceito. Para isso, propõe iniciativas como cursos de português, oficinas de capacitação, programas de mentoria, redes de apoio e ações de conscientização. Essas medidas visam facilitar a adaptação, promover a inclusão no mercado de trabalho e combater a xenofobia, contribuindo para uma sociedade mais justa e acolhedora, onde os refugiados possam reconstruir suas vidas com dignidade e autonomia.
          </p>
        </article>

        <article className="info-block mb-5">
          <h2>Nosso Público-Alvo</h2>
          <p>
            O projeto “Farol da Esperança” tem como público-alvo pessoas forçadas a deixar seus países. Considerando a diversidade de nacionalidades, etnias e níveis de escolaridade, o projeto será adaptável às necessidades específicas de cada grupo. Para garantir sua eficácia, será implementado de forma inclusiva e participativa, ouvindo os refugiados na identificação de demandas e avaliação dos resultados. Além de oferecer serviços, o projeto busca promover uma cultura de acolhimento e respeito, contribuindo para a integração e garantia de direitos desse público.
          </p>
        </article>

        <article className="info-block">
          <h2>Justificativa e Análise</h2>
          <p>
            A escolha do problema da falta de oportunidades e do isolamento social enfrentados por refugiados no Brasil foi baseada em dados oficiais e pesquisas que evidenciam as dificuldades de integração dessa população. Relatórios do ACNUR, CONARE e do Ministério da Justiça apontam barreiras como acesso limitado a serviços básicos, discriminação e dificuldades no mercado de trabalho. Além disso, estudos acadêmicos e pesquisas de organizações da sociedade civil analisam desafios em áreas como educação, saúde e moradia. Essas fontes ajudam a entender a realidade dos refugiados e embasam a formulação de soluções para sua inclusão.
          </p>
          <p>
            A análise de dados oficiais e pesquisas identificou a falta de oportunidades e o isolamento social como os principais desafios enfrentados por refugiados no Brasil. Barreiras no acesso a serviços básicos, discriminação e dificuldades na inserção no mercado de trabalho agravam a situação, especialmente pela não validação de diplomas e experiências profissionais. O projeto “Farol da Esperança” propõe soluções como cursos de português, capacitação, mentoria e ações de conscientização para promover a inclusão. As referências utilizadas incluem ACNUR, CONARE e o Ministério da Justiça, garantindo a credibilidade das informações.
          </p>
        </article>
      </section>
    </div>
  );
};
export default Home;
