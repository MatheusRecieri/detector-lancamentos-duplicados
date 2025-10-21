export function analyzeDuplicates(data) {
  // Exemplo simples — você pode adaptar conforme o formato real do arquivo
  const notas = [];
  const duplicatas = [];
  const possiveis = [];

  data.forEach((item) => {
    const match = notas.find(
      (n) => n.fornecedor === item.fornecedor && n.valor === item.valor
    );
    if (match) {
      duplicatas.push(item);
    } else {
      notas.push(item);
    }
  });

  return {
    summary: {
      total: notas.length,
      duplicadas: duplicatas.length,
      possiveisDuplicadas: possiveis.length,
    },
    duplicatas,
    possiveisDuplicatas: possiveis,
  };
}
