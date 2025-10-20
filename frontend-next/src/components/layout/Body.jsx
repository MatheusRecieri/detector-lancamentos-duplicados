import React from 'react';
import LoadVerifyFiles from '../LoadVerifyFiles';
import PropTypes from 'prop-types';

function Body({ analysis }) {
  if (!analysis) {
    return (
      <div className="body empty">
        <p>Nenhuma análise realizada ainda.</p>
      </div>
    );
  }

  return (
    <div className="body">
      <h2>Resultado da Análise</h2>

      <div className="analysis-sumary">
        <p>
          <strong>Total de Notas:</strong> {analysis.totalNotas}
        </p>
        <p>
          <strong>Duplicadas:</strong> {analysis.duplicadas?.length || 0}
        </p>
        <p>
          <strong>Possíveis Duplicadas:</strong>{' '}
          {analysis.possiveisDuplicadas?.length || 0}
        </p>
      </div>

      {/* Seção de duplicadas */}
      {analysis.duplicadas?.length > 0 && (
        <div className="duplicates section">
          <h3>Notas Duplicadas</h3>
          <table className="result-table">
            <thead>
              <tr>
                <th>Códigos</th>
                <th>Fornecedor</th>
                <th>Valor contábil</th>
                <th>Numero da nota</th>
                <th>Qtd.</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analysis.duplicadas.map((item, i) => (
                <tr key={i}>
                  <td>{item.nota}</td>
                  <td>{item.fornecedor}</td>
                  <td>{item.valor_contabil.toFixed(2)}</td>
                  <td>{item.n_nota}</td>
                  <td>{item.qtd}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Seção de ´possiveis duplicadas */}

      {analysis.possiveisDuplicadas?.length > 0 && (
        <div className="possible-duplicates-section">
          <h3>Possiveis duplicadas</h3>
          <table className="result-table possible">
            <thead>
              <tr>
                <th>Codigos</th>
                <th>Valor contábil</th>
                <th>Ntas Fiscais</th>
                <th>Qtd</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analysis.possiveisDuplicadas.map((item, i) => (
                <tr key={i}>
                  <td>{item.codigos}</td>
                  <td>{item.valor_contabil}</td>
                  <td>{item.nota}</td>
                  <td>{item.qtd}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

Body.propTypes = {
  analysis: PropTypes.shape({
    totalNotas: PropTypes.number,
    duplicadas: PropTypes.arrayOf(PropTypes.object),
    possiveisDuplicadas: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default Body;
