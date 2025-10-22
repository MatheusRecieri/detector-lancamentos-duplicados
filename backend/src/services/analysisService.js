// export function analyzeDuplicates(data) {
//   const notasUnicas = [];
//   const duplicatasExatas = [];
//   const possiveisDuplicatas = [];

//   // Filtra apenas itens válidos com código de fornecedor
//   const itensValidos = data.filter(item =>
//     item &&
//     item.codigoFornecedor &&
//     !isNaN(parseInt(item.codigoFornecedor)) &&
//     item.notaSerie &&
//     item.data &&
//     item.valorContabil
//   );

//   console.log(`📊 Itens válidos para análise: ${itensValidos.length}`);

//   // Mapa para rastrear duplicatas exatas
//   const mapaDuplicatasExatas = new Map();

//   // PASSO 1: Detectar duplicatas EXATAS
//   itensValidos.forEach((item) => {
//     // Chave para duplicata exata: fornecedor + nota + data + valor
//     const chaveExata = `${item.codigoFornecedor}|${item.notaSerie}|${item.data}|${item.valorContabil}`;

//     if (mapaDuplicatasExatas.has(chaveExata)) {
//       // É uma duplicata exata!
//       const itemOriginal = mapaDuplicatasExatas.get(chaveExata);
//       duplicatasExatas.push({
//         ...item,
//         chaveDuplicata: chaveExata,
//         itemOriginal: itemOriginal
//       });
      
//       console.log(`🚨 DUPLICATA EXATA: Fornecedor ${item.codigoFornecedor}, Nota ${item.notaSerie}, Data ${item.data}`);
//     } else {
//       // Primeiro registro com essa chave
//       mapaDuplicatasExatas.set(chaveExata, item);
//       notasUnicas.push(item);
//     }
//   });

//   // PASSO 2: Detectar POSSÍVEIS duplicatas
//   itensValidos.forEach((item, index) => {
//     // Não processa se já é duplicata exata
//     const ehDuplicataExata = duplicatasExatas.some(dup =>
//       dup.codigoFornecedor === item.codigoFornecedor &&
//       dup.notaSerie === item.notaSerie &&
//       dup.data === item.data
//     );

//     if (ehDuplicataExata) {
//       return;
//     }

//     // Chave para possível duplicata: fornecedor + valor
//     const chavePossivel = `${item.codigoFornecedor}|${item.valorContabil}`;

//     // Compara com TODOS os outros itens
//     for (let j = index + 1; j < itensValidos.length; j++) {
//       const outroItem = itensValidos[j];

//       // Verifica se o outro item também não é duplicata exata
//       const outroEhDuplicataExata = duplicatasExatas.some(dup =>
//         dup.codigoFornecedor === outroItem.codigoFornecedor &&
//         dup.notaSerie === outroItem.notaSerie &&
//         dup.data === outroItem.data
//       );

//       if (outroEhDuplicataExata) {
//         continue;
//       }

//       // Condições para possível duplicata
//       if (
//         item.codigoFornecedor === outroItem.codigoFornecedor &&
//         item.valorContabil === outroItem.valorContabil &&
//         item.notaSerie !== outroItem.notaSerie &&
//         isDataProxima(item.data, outroItem.data, 30)
//       ) {
//         const diferencaDias = calcularDiferencaDias(item.data, outroItem.data);
        
//         // Verifica se já não foi adicionado
//         const jaAdicionado = possiveisDuplicatas.some(p =>
//           (p.codigoFornecedor === item.codigoFornecedor && p.notaSerie === item.notaSerie) ||
//           (p.codigoFornecedor === outroItem.codigoFornecedor && p.notaSerie === outroItem.notaSerie)
//         );

//         if (!jaAdicionado) {
//           possiveisDuplicatas.push({
//             ...item,
//             chaveSimplificada: chavePossivel,
//             itemSimilar: outroItem,
//             diferencaDias: Math.round(diferencaDias)
//           });

//           console.log(`⚠️ POSSÍVEL DUPLICATA: Fornecedor ${item.codigoFornecedor}, ` +
//                      `Notas ${item.notaSerie} vs ${outroItem.notaSerie}, ` +
//                      `Diferença: ${Math.round(diferencaDias)} dias`);
//         }
        
//         break;
//       }
//     }
//   });

//   console.log(`✅ Análise concluída:
//     - Duplicatas Exatas: ${duplicatasExatas.length}
//     - Possíveis Duplicatas: ${possiveisDuplicatas.length}
//     - Notas Únicas: ${notasUnicas.length}`);

//   return {
//     summary: {
//       totalItensProcessados: data.length,
//       itensValidos: itensValidos.length,
//       duplicatasExatas: duplicatasExatas.length,
//       possiveisDuplicatas: possiveisDuplicatas.length,
//       notasUnicas: notasUnicas.length
//     },
//     duplicatas: duplicatasExatas,
//     possiveisDuplicatas: possiveisDuplicatas,
//     notasUnicas: notasUnicas
//   };
// }

// function isDataProxima(data1, data2, toleranciaDias = 30) {
//   try {
//     const diffDias = calcularDiferencaDias(data1, data2);
//     return diffDias <= toleranciaDias && diffDias > 0;
//   } catch (error) {
//     console.error('Erro ao verificar proximidade de datas:', error);
//     return false;
//   }
// }

// function calcularDiferencaDias(data1, data2) {
//   try {
//     // Converte DD/MM/YYYY para YYYY-MM-DD
//     const [dia1, mes1, ano1] = data1.split('/');
//     const [dia2, mes2, ano2] = data2.split('/');
    
//     const date1 = new Date(`${ano1}-${mes1}-${dia1}`);
//     const date2 = new Date(`${ano2}-${mes2}-${dia2}`);
    
//     if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
//       throw new Error('Data inválida');
//     }
    
//     const diffTime = Math.abs(date2 - date1);
//     const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
//     return diffDays;
//   } catch (error) {
//     console.error('Erro ao calcular diferença de dias:', error, { data1, data2 });
//     return Infinity;
//   }
// }

// // Função auxiliar para debug
// export function debugData(data) {
//   return data.map(item => ({
//     codigo: item.codigoFornecedor,
//     data: item.data,
//     nota: item.notaSerie,
//     valor: item.valorContabil,
//     fornecedor: item.fornecedor?.substring(0, 30) + '...'
//   }));
// }

// src/services/analysisService.js

/**
 * Análise de duplicatas robusta:
 * - normaliza valores (para Number)
 * - normaliza datas (padroniza dd/mm/yyyy)
 * - normaliza strings (trim, uppercase)
 * - gera chaves a partir de valores normalizados
 */

function normalizeNumberStringToFloat(str) {
  if (str === null || str === undefined) return NaN;
  if (typeof str === 'number') return Number(str);
  // remove espaços
  let s = String(str).trim();
  if (!s) return NaN;
  // substituir ponto de milhar e transformar vírgula em ponto
  // Ex.: "1.234,56" -> "1234.56"; "1234,56" -> "1234.56"; "1,234.56" -> handle english style
  // Detect english (dot decimal) if last 3 chars are .dd
  const last3 = s.slice(-3);
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');
  if (hasComma && !hasDot) {
    // "1234,56"
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (hasComma && hasDot) {
    // ambiguous: assume '.' is thousand and ',' is decimal: "1.234,56"
    // But if pattern looks like "1,234.56" (comma thousand, dot decimal), handle both cases:
    // decide by which separator appears later
    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) {
      // comma appears later -> likely comma decimal ("1.234,56")
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // dot appears later -> likely dot decimal ("1,234.56")
      s = s.replace(/,/g, '');
    }
  } else {
    // only dots or only digits -> remove any non-digit except dot
    s = s.replace(/,/g, '');
  }
  s = s.replace(/[^\d.-]/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? NaN : n;
}

function normalizeDateStringDDMMYYYY(str) {
  if (!str) return '';
  const s = String(str).trim();
  // If already ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-');
    return `${d.padStart(2,'0')}/${m.padStart(2,'0')}/${y}`;
  }
  // If DD/MM/YYYY or D/M/YYYY
  const m1 = s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (m1) {
    let [ , d, mth, y ] = m1;
    if (y.length === 2) {
      // assume 20xx for 2-digit
      y = `20${y}`;
    }
    return `${d.padStart(2,'0')}/${mth.padStart(2,'0')}/${y}`;
  }
  // fallback: return trimmed
  return s;
}

function normalizeStringKey(s) {
  if (s === null || s === undefined) return '';
  return String(s).trim().replace(/\s+/g, ' ').toUpperCase();
}

function normalizeNotaSerie(s) {
  if (s === null || s === undefined) return '';
  // remove non-alphanumeric except - and /
  return String(s).trim().replace(/\s+/g,' ').toUpperCase();
}

export function analyzeDuplicates(rawData, options = {}) {
  // rawData: array of parsed items from fileReaderService
  // expected fields used: codigoFornecedor, notaSerie, data, valorContabil (or valor)
  const itens = Array.isArray(rawData) ? rawData : [];
  const itensValidos = itens.filter(item => {
    if (!item) return false;
    const cf = (item.codigoFornecedor ?? item.fornecedor ?? '').toString().trim();
    const valor = item.valorContabil ?? item.valor ?? '';
    const data = item.data ?? '';
    return cf !== '' && data && valor !== undefined && valor !== null;
  });

  // Build normalized items with canonical fields
  const normalized = itensValidos.map((item, idx) => {
    const codigoFornecedor = normalizeStringKey(item.codigoFornecedor ?? item.fornecedor ?? '');
    const notaSerie = normalizeNotaSerie(item.notaSerie ?? item.nota ?? '');
    const data = normalizeDateStringDDMMYYYY(item.data ?? '');
    const valorContabilNum = normalizeNumberStringToFloat(item.valorContabil ?? item.valor ?? 0);
    const fornecedor = (item.fornecedor ?? '').toString().trim();
    return {
      __idx: idx,
      original: item,
      codigoFornecedor,
      notaSerie,
      data,
      valorContabilNum,
      fornecedor,
      rawValor: item.valorContabil ?? item.valor
    };
  });

  // Debug quick print (first 10 normalized)
  if (options.debug) {
    console.log('DEBUG - primeiros itens normalizados:', normalized.slice(0,10).map(n => ({
      codigoFornecedor: n.codigoFornecedor, notaSerie: n.notaSerie, data: n.data, valorContabilNum: n.valorContabilNum, rawValor: n.rawValor
    })));
  }

  const mapaExatas = new Map();
  const duplicatasExatas = [];
  const possiveisDuplicatas = [];
  const notasUnicas = [];

  // detectar duplicatas exatas - chave por fornecedor + nota + data + valor (num)
  for (const n of normalized) {
    const chaveExata = `${n.codigoFornecedor}|${n.notaSerie}|${n.data}|${Number.isFinite(n.valorContabilNum) ? n.valorContabilNum.toFixed(2) : 'NaN'}`;
    if (mapaExatas.has(chaveExata)) {
      const original = mapaExatas.get(chaveExata);
      // Adiciona o par como duplicata (pode ser um objeto contendo original e duplicado)
      duplicatasExatas.push({
        original: original.original,
        duplicate: n.original,
        codigoFornecedor: n.codigoFornecedor,
        notaSerie: n.notaSerie,
        data: n.data,
        valorContabil: n.valorContabilNum
      });
    } else {
      mapaExatas.set(chaveExata, n);
      notasUnicas.push(n.original);
    }
  }

  // detectar possíveis duplicatas: mesmo fornecedor + mesmo valor (num) e datas próximas (<=30 dias), notas diferentes
  for (let i = 0; i < normalized.length; i++) {
    const a = normalized[i];

    // se a já é parte de duplicata exata (como original ou duplicate), pule
    const isInExact = duplicatasExatas.some(d => (
      (d.original === a.original) || (d.duplicate === a.original)
    ));
    if (isInExact) continue;

    for (let j = i + 1; j < normalized.length; j++) {
      const b = normalized[j];

      const isInExactB = duplicatasExatas.some(d => (
        (d.original === b.original) || (d.duplicate === b.original)
      ));
      if (isInExactB) continue;

      if (
        a.codigoFornecedor === b.codigoFornecedor &&
        Number.isFinite(a.valorContabilNum) &&
        Number.isFinite(b.valorContabilNum) &&
        Math.abs(a.valorContabilNum - b.valorContabilNum) < 0.001 && // same numeric value
        a.notaSerie !== b.notaSerie
      ) {
        const diffDias = calcularDiferencaDias(a.data, b.data);
        if (diffDias !== Infinity && diffDias <= 30) {
          // Verificar se já existe par semelhante (evitar duplicatas na lista)
          const exists = possiveisDuplicatas.some(p =>
            (p.codigoFornecedor === a.codigoFornecedor &&
             ((p.notaA === a.notaSerie && p.notaB === b.notaSerie) ||
              (p.notaA === b.notaSerie && p.notaB === a.notaSerie)))
          );
          if (!exists) {
            possiveisDuplicatas.push({
              codigoFornecedor: a.codigoFornecedor,
              notaA: a.notaSerie,
              notaB: b.notaSerie,
              dataA: a.data,
              dataB: b.data,
              valorContabil: a.valorContabilNum,
              diferencaDias: Math.round(diffDias),
              itemA: a.original,
              itemB: b.original
            });
          }
        }
      }
    }
  }

  // Monta summary e objetos de retorno no formato esperado pelo controller
  const summary = {
    totalItensProcessados: itens.length,
    itensValidos: itensValidos.length,
    duplicatasExatas: duplicatasExatas.length,
    possiveisDuplicatas: possiveisDuplicatas.length,
    notasUnicas: notasUnicas.length
  };

  // Para manter compatibilidade com seu controller, retorno com campos esperados
  // duplicatas: array de objetos (mantemos o formato simplificado)
  const duplicatas = duplicatasExatas.map((d, i) => ({
    codigoFornecedor: d.codigoFornecedor,
    fornecedor: d.original.fornecedor ?? d.duplicate.fornecedor,
    data: d.data,
    notaSerie: d.notaSerie,
    valorContabil: d.valorContabil,
    chaveDuplicata: `${d.codigoFornecedor}|${d.notaSerie}|${d.data}|${d.valorContabil}`
  }));

  const possiveis = possiveisDuplicatas.map((p, i) => ({
    codigoFornecedor: p.codigoFornecedor,
    fornecedor: p.itemA.fornecedor ?? p.itemB.fornecedor,
    data: p.dataA,
    notaSerie: p.notaA,
    valorContabil: p.valorContabil,
    chaveSimplificada: `${p.codigoFornecedor}|${p.valorContabil.toFixed(2)}`,
    diferencaDias: p.diferencaDias,
    itemSimilar: p.itemB
  }));

  return {
    summary,
    duplicatas,
    possiveisDuplicatas: possiveis,
    notasUnicas
  };
}

// Helper usado também no original (mantenho sua função)
function calcularDiferencaDias(data1, data2) {
  try {
    if (!data1 || !data2) return Infinity;
    // espera dd/mm/yyyy
    const [d1, m1, y1] = String(data1).split('/');
    const [d2, m2, y2] = String(data2).split('/');
    if (!d1 || !m1 || !y1 || !d2 || !m2 || !y2) return Infinity;
    const date1 = new Date(`${y1}-${m1.padStart(2,'0')}-${d1.padStart(2,'0')}`);
    const date2 = new Date(`${y2}-${m2.padStart(2,'0')}-${d2.padStart(2,'0')}`);
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return Infinity;
    const diff = Math.abs(date2 - date1);
    return diff / (1000 * 60 * 60 * 24);
  } catch (err) {
    console.error('Erro calcularDiferencaDias:', err, { data1, data2 });
    return Infinity;
  }
}

export function debugData(data) {
  return (data || []).slice(0, 20).map(item => ({
    codigoFornecedor: item.codigoFornecedor,
    fornecedor: item.fornecedor,
    data: item.data,
    notaSerie: item.notaSerie,
    valorContabil: item.valorContabil
  }));
}

export default analyzeDuplicates;
