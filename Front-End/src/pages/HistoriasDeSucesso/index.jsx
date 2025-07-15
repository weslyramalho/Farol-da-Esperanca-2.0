import './historiasDeSucesso.css';

const HistoriasDeSucesso = () => {
    return (
        <main className="historias-container">
            <header className="historias-header">
                <h1>Histórias de Sucesso: Refugiados que Encontraram Oportunidades no Brasil</h1>
                <p>
                    As histórias a seguir demonstram o impacto do nosso site em ajudar imigrantes a superar desafios e encontrar emprego no Brasil, garantindo estabilidade e novas oportunidades em um país diferente.
                </p>
            </header>

            <section className="historias-grid">
                <article className="historia-card">
                    <div className="card-header">
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Foto de perfil genérica" className="profile-pic" />
                        <h3>Anjali Sharma, 28 anos (Índia)</h3>
                    </div>
                    <blockquote>
                        "A transição para o mercado de trabalho brasileiro foi assustadora, especialmente na área de tecnologia, que muda tão rápido. O caos no setor de tecnologia na Índia me fez buscar novos ares, e o Brasil parecia o lugar certo, mas eu precisava de apoio para entender a cultura de trabalho local. Encontrei o site e o quiz de preparação para entrevistas foi fundamental. Eu já tinha as habilidades técnicas, mas o quiz me ajudou a entender as expectativas e a linguagem usada em entrevistas no Brasil. Além disso, a plataforma de cadastro nos conectou diretamente com empresas que valorizam a diversidade e que estavam abertas a contratar talentos estrangeiros."
                    </blockquote>
                    <p className="job-info">
                        <strong>Hoje:</strong> Engenheira de Software Plena na InovaTech Solutions, com salário de R$ 8.500. "Sem a orientação do site, eu teria perdido muito tempo."
                    </p>
                </article>

                <article className="historia-card">
                    <div className="card-header">
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Foto de perfil genérica" className="profile-pic" />
                        <h3>Mateo Rodriguez, 45 anos (Venezuela)</h3>
                    </div>
                    <blockquote>
                        "Saímos da Venezuela devido à crise econômica e política. Cheguei ao Brasil com anos de experiência em construção civil, mas sem entender a legislação ou os documentos necessários para trabalhar legalmente. As portas pareciam fechadas. O site me ofereceu os cursos sobre documentação e direitos trabalhistas para imigrantes. Isso me deu a confiança e o conhecimento para regularizar minha situação e apresentar meu currículo corretamente. Usei o cadastro para destacar minha experiência e, em poucas semanas, fui contatado."
                    </blockquote>
                    <p className="job-info">
                        <strong>Hoje:</strong> Mestre de Obras na Construtora Horizonte, com salário de R$ 4.200. "O site não só me ajudou a encontrar um emprego, mas também me devolveu a dignidade profissional."
                    </p>
                </article>

                <article className="historia-card">
                    <div className="card-header">
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Foto de perfil genérica" className="profile-pic" />
                        <h3>Elena Petrova, 34 anos (Ucrânia)</h3>
                    </div>
                    <blockquote>
                        "A guerra na Ucrânia mudou tudo. Quando cheguei ao Brasil, o foco era a segurança, mas a preocupação com o sustento era enorme. Minha fluência em português ainda era limitada, e a área da saúde é muito regulamentada. O site foi um alívio. O curso de português focado em termos profissionais e o material de preparação para entrevistas na área de saúde me deram o vocabulário e a confiança necessários. A plataforma me conectou com a Clínica Vida Nova, que buscava profissionais de apoio."
                    </blockquote>
                    <p className="job-info">
                        <strong>Hoje:</strong> Assistente de Enfermagem na Clínica Vida Nova, ganhando R$ 3.500. "É um começo seguro e um passo importante para reconstruir minha vida aqui."
                    </p>
                </article>

                <article className="historia-card">
                    <div className="card-header">
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Foto de perfil genérica" className="profile-pic" />
                        <h3>Kenji Tanaka, 52 anos (Japão)</h3>
                    </div>
                    <blockquote>
                        "A busca por novas oportunidades após o declínio de minha antiga empresa no Japão me levou ao Brasil. Embora eu tenha décadas de experiência em administração, as práticas de negócios e a comunicação no Brasil são muito diferentes. Parecia que minha idade era uma barreira aqui. O site me ajudou a adaptar meu currículo para o formato brasileiro e a entender como aplicar minha experiência em um contexto diferente. Os materiais sobre o mercado de trabalho me mostraram que minha experiência era valorizada, desde que apresentada da forma correta."
                    </blockquote>
                    <p className="job-info">
                        <strong>Hoje:</strong> Assistente Administrativo Sênior na Logística Global Brasil, com salário de R$ 5.100. "A plataforma me ajudou a traduzir minha experiência e a mostrar meu valor no mercado brasileiro."
                    </p>
                </article>

                <article className="historia-card">
                    <div className="card-header">
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Foto de perfil genérica" className="profile-pic" />
                        <h3>Amina Diallo, 23 anos (República Democrática do Congo)</h3>
                    </div>
                    <blockquote>
                        "Fugir da instabilidade política na RDC foi doloroso. Cheguei ao Brasil sem rede de apoio e sem experiência formal de trabalho. Precisava de um emprego rápido em qualquer área para sobreviver. O site foi meu primeiro contato com o mercado de trabalho brasileiro. As dicas sobre como se comportar em entrevistas, mesmo para vagas de nível de entrada, e as opções de cursos básicos foram muito úteis."
                    </blockquote>
                    <p className="job-info">
                        <strong>Hoje:</strong> Garçonete no Restaurante Sabor do Mundo, com salário de R$ 2.800 (mais gorjetas). "Não é apenas um trabalho, é a minha chance de começar de novo, e o site me deu o empurrão inicial."
                    </p>
                </article>
            </section>
        </main>
    );
}
export default HistoriasDeSucesso;
