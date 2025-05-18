const ListarVagas =({ vagas, onAplicar, termoPesquisa, onPesquisaChange, totalVagasSemFiltro }) =>{
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

      {vagas.length === 0 && termoPesquisa && (
        <p className="text-center text-muted mt-5">Nenhuma vaga encontrada com os critérios de pesquisa.</p>
      )}
      {vagas.length === 0 && !termoPesquisa && totalVagasSemFiltro === 0 && (
         <p className="text-center text-muted mt-5">Nenhuma vaga cadastrada no momento.</p>
      )}
      {vagas.length === 0 && !termoPesquisa && totalVagasSemFiltro > 0 && (
         <p className="text-center text-muted mt-5">Todas as vagas foram filtradas. Limpe a pesquisa para ver mais.</p>
      )}


      <div className="row row-cols-1 row-cols-md-1 g-4">
        {vagas.map(vaga => (
          <div key={vaga.id} className="col">
            <div className="card h-100 shadow-sm hover-shadow"> {/* hover-shadow é uma classe customizada, Bootstrap não tem por padrão */}
              <style jsx global>{`
                .hover-shadow:hover {
                  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
                }
              `}</style>
              <div className="card-body d-flex flex-column">
                <h3 className="card-title h5 text-primary">{vaga.titulo}</h3>
                <p className="card-subtitle mb-2 text-muted fw-bold">{vaga.empresa}</p>
                <p className="card-text small mb-1">{vaga.local} - {vaga.tipoContrato}</p>
                <p className="card-text small" style={{whiteSpace: 'pre-line', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vaga.descricao.substring(0,150)}...</p>
                {vaga.salario && <p className="card-text small"><strong>Salário:</strong> {vaga.salario}</p>}
                <p className="card-text mt-auto pt-2"><small className="text-muted">Cadastrada em: {vaga.dataCadastro}</small></p>
                <button 
                  onClick={() => onAplicar(vaga)}
                  className="btn btn-info btn-sm align-self-start mt-2">
                  Ver Detalhes / Aplicar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListarVagas;