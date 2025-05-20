import { SearchIcon } from "../icons";


const ListarVagas = ({ vagas, onAplicar, termoPesquisa, onPesquisaChange, totalVagasSemFiltro }) => {
  return (
    <div className="mx-auto" style={{ maxWidth: '900px' }}>
      <h2 className="h3 mb-4 text-center text-md-start">Vagas em Aberto</h2>
      
      {/* Barra de Pesquisa */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text" id="basic-addon1"><SearchIcon /></span>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Pesquisar por título, empresa ou local..." 
            aria-label="Pesquisar vagas"
            value={termoPesquisa}
            onChange={onPesquisaChange}
          />
        </div>
      </div>

      {/* Mensagens de feedback */}
      {vagas.length === 0 ? (
        <div className="text-center text-muted mt-5">
          {termoPesquisa ? (
            <p>Nenhuma vaga encontrada com os critérios de pesquisa.</p>
          ) : totalVagasSemFiltro === 0 ? (
            <p>Nenhuma vaga cadastrada no momento.</p>
          ) : (
            <p>Todas as vagas foram filtradas. Limpe a pesquisa para ver mais.</p>
          )}
        </div>
      ) : null}

      {/* Lista de Vagas */}
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {vagas.map(vaga => (
          <div key={vaga.id} className="col">
            <div className="card h-100 shadow-sm hover-effect">
              <div className="card-body d-flex flex-column">
                <h3 className="card-title h5 text-primary">{vaga.titulo}</h3>
                <p className="card-subtitle mb-2 text-muted fw-bold">{vaga.empresa}</p>
                <p className="card-text small mb-1">{vaga.local} - {vaga.tipoContrato}</p>
                <p className="card-text small text-truncate" style={{ WebkitLineClamp: 3 }}>
                  {vaga.descricao}
                </p>
                {vaga.salario && (
                  <p className="card-text small">
                    <strong>Salário:</strong> {vaga.salario}
                  </p>
                )}
                <p className="card-text mt-auto pt-2">
                  <small className="text-muted">Cadastrada em: {vaga.dataCadastro}</small>
                </p>
                <button 
                  onClick={() => onAplicar(vaga)}
                  className="btn btn-info btn-sm align-self-start mt-2"
                >
                  Ver Detalhes / Aplicar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estilos */}
      <style jsx>{`
        .hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ListarVagas;