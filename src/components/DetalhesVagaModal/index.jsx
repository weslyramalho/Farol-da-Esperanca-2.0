import './detalhesVagaModal.css'

const DetalhesVagaModal = ({ vaga, onClose, onAplicarCurriculo }) => {
    if (!vaga) return null;

    return (
        <div className="modalStyle modal fade show" tabIndex="-1"  onClick={onClose}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
                <div className="modal-content rounded-3 shadow">
                    <div className="modal-header bg-primary text-white">
                        <h4 className="modal-title">{vaga.titulo}</h4>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p className="h6 text-secondary">{vaga.empresa}</p>
                        <p><span className="fw-semibold">Local:</span> {vaga.local}</p>
                        <p><span className="fw-semibold">Tipo de Contrato:</span> {vaga.tipoContrato}</p>
                        {vaga.salario && <p><span className="fw-semibold">Salário:</span> {vaga.salario}</p>}
                        
                        <hr className="my-3"/>
                        <h5 className="mt-3 mb-2">Descrição Completa:</h5>
                        <p style={{whiteSpace: 'pre-line'}} className="text-body-secondary">{vaga.descricao}</p>
                        
                        <p className="mt-3"><small className="text-muted">Vaga cadastrada em: {vaga.dataCadastro}</small></p>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button"
                            onClick={() => {
                                onAplicarCurriculo(vaga);
                                alert(`Aplicação para "${vaga.titulo}" registrada (simulação).`);
                                onClose();
                            }}
                            className="btn btn-success">
                            Aplicar para esta vaga
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DetalhesVagaModal;