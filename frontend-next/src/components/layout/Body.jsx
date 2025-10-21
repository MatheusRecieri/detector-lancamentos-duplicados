import React from 'react';
import { fileService } from '../../services/api';

const Body = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70 text-lg">
          Faça upload de um arquivo para analisar lançamentos duplicados
        </p>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!analysis.processId) {
      alert('ID do processo não disponível para download');
      return;
    }

    try {
      await fileService.downloadExcel(analysis.processId);
    } catch (error) {
      console.error('Erro no download:', error);
      alert('Erro ao baixar relatório: ' + error.message);
    }
  };

  return (
    <div className="mt-8">
      {/* Resumo da Análise */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-300/20">
          <h3 className="text-white text-sm font-semibold mb-2">
            TOTAL DE LANÇAMENTOS
          </h3>
          <p className="text-3xl font-bold text-white">
            {analysis.totalEntries || 0}
          </p>
        </div>

        <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-6 text-center border border-red-300/20">
          <h3 className="text-white text-sm font-semibold mb-2">
            DUPLICATAS CONFIRMADAS
          </h3>
          <p className="text-3xl font-bold text-white">
            {analysis.duplicates?.length || 0}
          </p>
        </div>

        <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-6 text-center border border-yellow-300/20">
          <h3 className="text-white text-sm font-semibold mb-2">
            POSSÍVEIS DUPLICATAS
          </h3>
          <p className="text-3xl font-bold text-white">
            {analysis.possibleDuplicates || 0}
          </p>
        </div>
      </div>

      {/* Duplicatas Confirmadas */}
      {analysis.duplicates && analysis.duplicates.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="w-2 h-6 bg-red-500 rounded-full mr-3"></span>
            Duplicatas Confirmadas
          </h3>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/80 font-semibold">
                      Linha
                    </th>
                    <th className="text-left p-4 text-white/80 font-semibold">
                      Descrição
                    </th>
                    <th className="text-left p-4 text-white/80 font-semibold">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.duplicates.map((dup, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-white/90">{dup.line}</td>
                      <td className="p-4 text-white/90">{dup.description}</td>
                      <td className="p-4 text-white/90 font-semibold">
                        R${' '}
                        {typeof dup.value === 'number'
                          ? dup.value.toFixed(2)
                          : dup.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Botão de Download */}
      {analysis.processId && (
        <div className="text-center">
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-green-500 shadow-lg flex items-center mx-auto"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Baixar Relatório em Excel
          </button>
        </div>
      )}

      {!analysis.duplicates?.length && !analysis.possibleDuplicates && (
        <div className="text-center py-8">
          <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-300/20">
            <svg
              className="w-12 h-12 text-green-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhuma Duplicata Encontrada
            </h3>
            <p className="text-white/70">
              Não foram detectados lançamentos duplicados no arquivo analisado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;
