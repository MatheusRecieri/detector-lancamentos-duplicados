export function extractEntriesFromPDFText(text) {
  // Normaliza o texto
  const cleaned = text
    .replace(/\r?\n|\r/g, " ") // remove quebras de linha
    .replace(/\s+/g, " ") // remove espaços múltiplos
    .trim();

  // Regex para capturar blocos
  const regex = /(\d{14,})\s+([A-Z\s\.&\-]+?)\s+(NF-\d{3,})\s+([\d.,]+)/g;

  const entries = [];
  let match;
  while ((match = regex.exec(cleaned)) !== null) {
    entries.push({
      codigo: match[1],
      fornecedor: match[2].trim(),
      nf: match[3],
      valor: match[4].replace(".", "").replace(",", "."),
    });
  }

  return entries;
}
