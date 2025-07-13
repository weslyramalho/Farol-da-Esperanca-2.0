import PropTypes from 'prop-types';
import './visualizarCurriculoModal.css'

const VisualizarCurriculoModal= ({ curriculo, onClose }) =>{
     if (!curriculo) {
        return (
            <div className="modal fade show" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <p>Nenhum currículo selecionado</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="modal fade show" 
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
        >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content rounded-3 shadow">
                    <div className="modal-header padrao text-white">
                        <h4 className="modal-title">Currículo de {curriculo.nome}</h4>
                        
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={onClose}
                            aria-label="Fechar modal"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* ... conteúdo existente ... */}
                        <h5 className=''>Telefone: {curriculo.telefone}</h5>
                        <h5 className=''>Email: {curriculo.email}</h5>
                        <h5 className=''>LinKedin: {curriculo.linkedin}</h5>
                        <h5 className=''>Resumo: {curriculo.resumo}</h5>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary" 
                            onClick={onClose}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

VisualizarCurriculoModal.propTypes = {
    curriculo: PropTypes.shape({
        nome: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        telefone: PropTypes.string,
        linkedin: PropTypes.string,
        resumo: PropTypes.string,
        nomeArquivo: PropTypes.string,
        dataEnvio: PropTypes.string
    }),
    onClose: PropTypes.func.isRequired
        
}



export default VisualizarCurriculoModal