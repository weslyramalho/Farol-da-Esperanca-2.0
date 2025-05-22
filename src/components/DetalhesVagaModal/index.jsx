import './detalhesVagaModal.css'
import PropTypes from 'prop-types';

const DetalhesVagaModal = ({vagaSelecionada}) => {
    if (!vagaSelecionada){
        return null
    }

    return (
         <div>
              <h4>{vagaSelecionada?.titulo}</h4>
              <p><strong>Empresa:</strong> {vagaSelecionada?.empresa}</p>
              <p><strong>Local:</strong> {vagaSelecionada?.local}</p>
              <p><strong>Tipo de Contrato:</strong> {vagaSelecionada?.tipoContrato}</p>
              <p><strong>Salário:</strong> {vagaSelecionada?.salario}</p>
              <div className="mt-3">
                <h5>Descrição:</h5>
                <p style={{ whiteSpace: 'pre-line' }}>{vagaSelecionada?.descricao}</p>
              </div>
              <p className="text-muted mt-3">
                <small>Cadastrada em: {vagaSelecionada?.dataCadastro}</small>
              </p>
            </div>
    );
}

DetalhesVagaModal.propTypes = {
    vaga: PropTypes.shape({
        titulo: PropTypes.string.isRequired,
        empresa: PropTypes.string.isRequired,
        local: PropTypes.string.isRequired,
        tipoContrato: PropTypes.string.isRequired,
        salario: PropTypes.string,
        descricao: PropTypes.string.isRequired,
        dataCadastro: PropTypes.string.isRequired
    }),
    onClose: PropTypes.func.isRequired,
    onAplicarCurriculo: PropTypes.func.isRequired
};
export default DetalhesVagaModal;