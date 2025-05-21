import { useState } from 'react';
import { ModalCustom, ButtonCustom, ModalHeader, ModalBody, ModalFooter } from '../Modal';

const VagasEmpresa = ({ vagas, onAtualizarVaga, onRemoverVaga }) => {
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Estados para o formulário de edição
  const [tituloEditado, setTituloEditado] = useState('');
  const [empresaEditada, setEmpresaEditada] = useState('');
  const [localEditado, setLocalEditado] = useState('');
  const [descricaoEditada, setDescricaoEditada] = useState('');
  const [salarioEditado, setSalarioEditado] = useState('');
  const [tipoContratoEditado, setTipoContratoEditado] = useState('CLT');

  const handleEditar = (vaga) => {
    setVagaSelecionada(vaga);
    setTituloEditado(vaga.titulo);
    setEmpresaEditada(vaga.empresa);
    setLocalEditado(vaga.local);
    setDescricaoEditada(vaga.descricao);
    setSalarioEditado(vaga.salario);
    setTipoContratoEditado(vaga.tipoContrato);
    setModoEdicao(true);
    setShowModal(true);
  };

  const handleVisualizar = (vaga) => {
    setVagaSelecionada(vaga);
    setModoEdicao(false);
    setShowModal(true);
  };

  const handleSalvarEdicao = () => {
    const vagaAtualizada = {
      ...vagaSelecionada,
      titulo: tituloEditado,
      empresa: empresaEditada,
      local: localEditado,
      descricao: descricaoEditada,
      salario: salarioEditado,
      tipoContrato: tipoContratoEditado
    };
    
    onAtualizarVaga(vagaAtualizada);
    setShowModal(false);
  };

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
      onRemoverVaga(id);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="mb-4">Vagas Cadastradas</h2>
      
      {vagas.length === 0 ? (
        <div className="alert alert-info">Nenhuma vaga cadastrada ainda.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Título</th>
                <th>Empresa</th>
                <th>Local</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vagas.map((vaga) => (
                <tr key={vaga.id}>
                  <td>{vaga.titulo}</td>
                  <td>{vaga.empresa}</td>
                  <td>{vaga.local}</td>
                  <td>{vaga.tipoContrato}</td>
                  <td>
                    <ButtonCustom 
                      variant="primary"
                      onClick={() => handleVisualizar(vaga)}
                    >
                      Visualizar
                    </ButtonCustom>
                    <ButtonCustom 
                      variant="secondary"
                      onClick={() => handleEditar(vaga)}
                    >
                      Editar
                    </ButtonCustom>
                    <ButtonCustom 
                      variant="danger"
                      onClick={() => handleExcluir(vaga.id)}
                    >
                      Excluir
                    </ButtonCustom>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalCustom show={showModal} onHide={() => setShowModal(false)} size="lg">
        <ModalHeader>
          <h3>{modoEdicao ? 'Editar Vaga' : 'Detalhes da Vaga'}</h3>
        </ModalHeader>
        <ModalBody>
          {modoEdicao ? (
            <form>
              <div className="mb-3">
                <label className="form-label">Título*</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={tituloEditado}
                  onChange={(e) => setTituloEditado(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Empresa*</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={empresaEditada}
                  onChange={(e) => setEmpresaEditada(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Local*</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={localEditado}
                  onChange={(e) => setLocalEditado(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição*</label>
                <textarea 
                  className="form-control"
                  rows="4"
                  value={descricaoEditada}
                  onChange={(e) => setDescricaoEditada(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Salário</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={salarioEditado}
                  onChange={(e) => setSalarioEditado(e.target.value)}
                  placeholder="Ex: R$ 3.000,00 ou A combinar"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de Contrato</label>
                <select 
                  className="form-select"
                  value={tipoContratoEditado}
                  onChange={(e) => setTipoContratoEditado(e.target.value)}
                >
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="Estágio">Estágio</option>
                  <option value="Temporário">Temporário</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </form>
          ) : (
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
          )}
        </ModalBody>
        <ModalFooter>
          {modoEdicao ? (
            <>
              <ButtonCustom variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </ButtonCustom>
              <ButtonCustom variant="primary" onClick={handleSalvarEdicao}>
                Salvar Alterações
              </ButtonCustom>
            </>
          ) : (
            <ButtonCustom variant="secondary" onClick={() => setShowModal(false)}>
              Fechar
            </ButtonCustom>
          )}
        </ModalFooter>
      </ModalCustom>
    </div>
  );
};

export default VagasEmpresa;