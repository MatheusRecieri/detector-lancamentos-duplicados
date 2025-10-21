export function analyzeDuplicates(data) {
  const notas = [];
  const duplicatas = [];
  const possiveis = [];

  // Filtra apenas itens válidos com código de fornecedor
  const itensValidos = data.filter(item =>
    item &&
    item.codigoFornecedor &&
    !isNaN(parseInt(item.codigoFornecedor)) &&
    item.notaSerie &&
    item.data
  );

  // Mapa para rastrear duplicatas
  const mapaDuplicatas = new Map();

  // Busca por duplicatas exatas
  itensValidos.forEach((item) => {
    // Cria uma chave única baseada nos campos mais importantes
    const chave = `${item.codigoFornecedor}-${item.notaSerie}-${item.data}-${item.valorContabil}`;

    const chaveSimplificada = `${item.codigoFornecedor}-${item.notaSerie}-${item.valorContabil}`;

    if (mapaDuplicatas.has(chave)) {
      // Duplicata exata encontrada
      duplicatasExatas.push({
        ...item,
        chaveDuplicata: chave,
        itemOriginal: mapaDuplicatas.get(chave)
      });
    } else {
      mapaDuplicatas.set(chave, item);
      notasUnicas.push(item);
    }

    // Verifica por possíveis duplicatas (mesmo fornecedor e valor em datas próximas)
    const possivelDuplicata = notasUnicas.find(nota =>
      nota.codigoFornecedor === item.codigoFornecedor &&
      nota.valorContabil === item.valorContabil &&
      nota.notaSerie !== item.notaSerie &&
      isDataProxima(nota.data, item.data, 7) // 7 dias de tolerância
    );

    if (possivelDuplicata &&
      !duplicatasExatas.find(d => d.chave === chave) &&
      !possiveisDuplicatas.find(p => p.chaveSimplificada === chaveSimplificada)) {
      possiveisDuplicatas.push({
        ...item,
        chaveSimplificada,
        itemSimilar: possivelDuplicata,
        diferencaDias: calcularDiferencaDias(possivelDuplicata.data, item.data)
      });
    }
  });

  return {
    summary: {
      totalItensProcessados: data.length,
      itensValidos: itensValidos.length,
      duplicatasExatas: duplicatasExatas.length,
      possiveisDuplicatas: possiveisDuplicatas.length,
      notasUnicas: notasUnicas.length
    },
    duplicatas: duplicatasExatas,
    possiveisDuplicatas: possiveisDuplicatas,
    notasUnicas: notasUnicas
  };
}

function isDataProxima(data1, data2, toleranciaDias = 7) {
    const diffDias = calcularDiferencaDias(data1, data2);
    return diffDias <= toleranciaDias && diffDias > 0;
}

function calcularDiferencaDias(data1, data2) {
    const date1 = new Date(data1.split('/').reverse().join('-'));
    const date2 = new Date(data2.split('/').reverse().join('-'));
    return Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
}

// Função auxiliar para debug
export function debugData(data) {
    return data.map(item => ({
        codigo: item.codigoFornecedor,
        data: item.data,
        nota: item.notaSerie,
        valor: item.valorContabil,
        fornecedor: item.fornecedor?.substring(0, 30) + '...'
    }));
}