import * as XLSX from 'xlsx';

export const exportToExcel = (analysisData) => {
  try {
    console.log('📊 Dados recebidos para exportação:', analysisData);

    // ✅ CORREÇÃO: Verificar se analysisData existe e usar estrutura correta
    if (!analysisData) {
      throw new Error('Dados de análise não fornecidos');
    }

    // ✅ CORREÇÃO: Usar as propriedades corretas da sua análise
    const totalEntries = analysisData.totalEntries || 0;
    const possibleDuplicates = analysisData.possibleDuplicates || 0;
    const duplicates = analysisData.duplicates || [];
    const filename = analysisData.filename || 'arquivo';
    const processId = analysisData.processId || 'sem-id';

    // Criar uma nova pasta de trabalho
    const workbook = XLSX.utils.book_new();

    // ✅ CORREÇÃO: Planilha de RESUMO
    const summaryData = [
      ['RELATÓRIO DE ANÁLISE DE DUPLICATAS'],
      [''],
      ['Arquivo Analisado:', filename],
      ['ID do Processo:', processId],
      ['Data da Análise:', new Date().toLocaleString('pt-BR')],
      [''],
      ['RESUMO'],
      ['Total de Lançamentos:', totalEntries],
      ['Possíveis Duplicatas:', possibleDuplicates],
      ['Duplicatas Confirmadas:', duplicates.length],
      [''],
      ['LEGENDA:'],
      ['- Duplicatas Confirmadas: Lançamentos idênticos detectados'],
      ['- Possíveis Duplicatas: Lançamentos similares que necessitam verificação']
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

    // ✅ CORREÇÃO: Planilha de DUPLICATAS CONFIRMADAS
    if (duplicates.length > 0) {
      const duplicatesData = [
        ['DUPLICATAS CONFIRMADAS'],
        [''],
        ['Linha', 'Descrição', 'Valor (R$)']
      ];

      duplicates.forEach(dup => {
        duplicatesData.push([
          dup.line || 'N/A',
          dup.description || 'N/A',
          typeof dup.value === 'number' ? dup.value.toFixed(2) : dup.value
        ]);
      });

      const duplicatesSheet = XLSX.utils.aoa_to_sheet(duplicatesData);
      XLSX.utils.book_append_sheet(workbook, duplicatesSheet, 'Duplicatas Confirmadas');
    }

    // ✅ CORREÇÃO: Planilha de DETALHES COMPLETOS (se existirem dados completos)
    if (analysisData.allEntries && analysisData.allEntries.length > 0) {
      const detailsData = [
        ['DETALHES COMPLETOS DOS LANÇAMENTOS'],
        [''],
        ['Linha', 'Descrição', 'Valor (R$)', 'Status']
      ];

      analysisData.allEntries.forEach(entry => {
        detailsData.push([
          entry.line || 'N/A',
          entry.description || 'N/A',
          typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value,
          entry.status || 'Normal'
        ]);
      });

      const detailsSheet = XLSX.utils.aoa_to_sheet(detailsData);
      XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Todos Lançamentos');
    }

    // Gerar buffer Excel
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    console.log('✅ Arquivo Excel gerado com sucesso');
    return excelBuffer;

  } catch (error) {
    console.error('❌ Erro ao gerar Excel:', error);
    throw new Error(`Falha na exportação para Excel: ${error.message}`);
  }
};
