import React from 'react';
import LoadVerifyFiles from '../LoadVerifyFiles';
import PropTypes from 'prop-types';

function Body({ analysis }) {
  if (!analysis) {
    return (
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center text-gray-600">
        <p className="text-lg">Nenhuma análise realizada ainda.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Resultado da Análise
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-900 text-white rounded-xl p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Total de Notas</p>
          <p className="text-2xl font-bold mt-1">{analysis.totalNotas}</p>
        </div>
        <div className="bg-red-600 text-white rounded-xl p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Duplicadas</p>
          <p className="text-2xl font-bold mt-1">
            {analysis.duplicadas?.length || 0}
          </p>
        </div>
        <div className="bg-orange-500 text-white rounded-xl p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Possíveis Duplicadas</p>
          <p className="text-2xl font-bold mt-1">
            {analysis.possiveisDuplicadas?.length || 0}
          </p>
        </div>
      </div>

      {/* Duplicadas Confirmadas */}
      {analysis.duplicadas?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
            <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
            Notas Duplicadas Confirmadas
          </h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Códigos
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Fornecedor
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Valor Contábil
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Nº da Nota
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Qtd.
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analysis.duplicadas.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {item.nota}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.fornecedor}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      R$ {item.valor_contabil.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">
                      {item.n_nota}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-semibold">
                      {item.qtd}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Possíveis Duplicadas */}
      {analysis.possiveisDuplicadas?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-orange-500 mb-4 flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
            Possíveis Duplicatas
          </h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Códigos
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Valor Contábil
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Notas Fiscais
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Qtd
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analysis.possiveisDuplicadas.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {item.codigos}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      R$ {item.valor_contabil}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">
                      {item.nota}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-semibold">
                      {item.qtd}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
