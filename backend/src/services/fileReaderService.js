import fs from "fs/promises";
import { PDFParse} from "pdf-parse";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

export async function readFileContent(filePath, mimeType) {
    try {
        
        if (mimeType.includes("pdf")) {
            const buffer = await fs.readFile(filePath);
            const parser = new PDFParse({ data: buffer})
            const data = await parser.getText(buffer);

            if (!data.text) {
                throw new Error("Não foi possível extrair texto do PDF");
            }

            return parsePDFToStructuredData(data.text);
        }

        if (mimeType.includes("word") || mimeType.includes("docx")) {
            const buffer = await fs.readFile(filePath);
            const { value } = await mammoth.extractRawText({ buffer });

            if (!value) {
                throw new Error("Não foi possível extrair texto do Word");
            }

            return extractLines(value);
        }

        if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            return json.filter(row => row.length > 0);
        }

        if (mimeType.includes("text")) {
            const data = await fs.readFile(filePath, "utf-8");
            return extractLines(data);
        }

        throw new Error("Tipo de arquivo não suportado");
    } catch (error) {
        console.error("Erro na leitura do arquivo:", error);
        throw error;
    }
}

function parsePDFToStructuredData(text) {
    const lines = extractLines(text);
    const structuredData = [];
    let currentItem = null;

    console.log(`Total de linhas extraídas: ${lines.length}`);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Ignora cabeçalhos, rodapés e linhas irrelevantes
        if (isHeaderLine(line) || isFooterLine(line) || !isDataLine(line)) {
            continue;
        }

        // Tenta extrair dados estruturados da linha
        const itemData = extractStructuredDataFromLine(line);
        
        if (itemData && itemData.codigoFornecedor) {
            if (currentItem && currentItem.codigoFornecedor) {
                structuredData.push(currentItem);
            }
            currentItem = itemData;
        } else if (currentItem) {
            // Linha complementar (impostos, etc.)
            processComplementaryLine(currentItem, line);
        }
    }

    // Adiciona o último item se existir
    if (currentItem && currentItem.codigoFornecedor) {
        structuredData.push(currentItem);
    }

    console.log(`Itens estruturados encontrados: ${structuredData.length}`);
    return structuredData;
}

function isHeaderLine(line) {
    const headerPatterns = [
        /POSTO JUPITER LTDA/,
        /ACOMPANHAMENTO DE ENTRADAS/,
        /CNPJ:/,
        /Insc Est:/,
        /Período:/,
        /Código Fornecedor/,
        /Data\s+Nota/,
        /Base Cálculo/,
        /Hora:/,
        /Emissão:/,
        /Página:/
    ];
    return headerPatterns.some(pattern => pattern.test(line));
}

function isFooterLine(line) {
    const footerPatterns = [
        /Sistema licenciado/,
        /Total Geral/,
        /Total CFOP/
    ];
    return footerPatterns.some(pattern => pattern.test(line));
}

function isDataLine(line) {
    // Linhas de dados geralmente começam com código numérico de fornecedor
    const dataPattern = /^\d{3,4}\s+[\d.,]+\s+[\d.,]+\s+\d+\s+\d{2}\/\d{2}\/\d{4}/;
    return dataPattern.test(line) || 
           // Ou são linhas de impostos complementares
           /^\s*(IRRF|ISS RET|CRF|INSS-RET)/.test(line) ||
           // Ou linhas com datas específicas
           /\d{2}\/\d{2}\/\d{4}\s+\d/.test(line);
}

function extractStructuredDataFromLine(line) {
    // Padrão mais flexível para capturar dados do PDF
    // Exemplo: "3077 0,00 2.142,00 2 28/01/2025 202500000000028 0 39 0,00 0,00 0,00 FS PROCESSAMENTO DE DADOS LTDA MG"
    const mainDataPattern = /^(\d{3,4})\s+([\d.,]+)\s+([\d.,]+)\s+(\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+([^\s]+(?:\s+[^\s]+)*?)\s+(\d+)\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)\s+(.+?)\s+([A-Z]{2})$/;
    
    const match = line.match(mainDataPattern);
    
    if (match && match.length >= 13) {
        try {
            return {
                codigoFornecedor: match[1]?.trim() || '',
                baseCalculo: match[2]?.trim() || '0,00',
                aliquota: match[3]?.trim() || '0,00',
                isentas: match[4]?.trim() || '0',
                data: match[5]?.trim() || '',
                notaSerie: match[6]?.trim() || '',
                especie: match[7]?.trim() || '',
                cfop: match[8]?.trim() || '',
                valorContabil: match[9]?.trim() || '0,00',
                valor: match[10]?.trim() || '0,00',
                outras: match[11]?.trim() || '0,00',
                fornecedor: match[12]?.trim() || '',
                uf: match[13]?.trim() || '',
                tipoImposto: 'ISS',
                impostos: []
            };
        } catch (error) {
            console.warn('Erro ao processar linha:', line);
            console.warn('Match:', match);
            return null;
        }
    }

    // Tentativa com padrão alternativo para linhas com formato diferente
    const alternativePattern = /^(\d{3,4})\s+([\d.,]+)\s+([\d.,]+)\s+(\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([A-Z]{2})$/;
    const altMatch = line.match(alternativePattern);
    
    if (altMatch && altMatch.length >= 7) {
        try {
            // Para linhas mais simples, preenchemos campos básicos
            return {
                codigoFornecedor: altMatch[1]?.trim() || '',
                baseCalculo: altMatch[2]?.trim() || '0,00',
                aliquota: altMatch[3]?.trim() || '0,00',
                isentas: altMatch[4]?.trim() || '0',
                data: altMatch[5]?.trim() || '',
                notaSerie: '',
                especie: '',
                cfop: '',
                valorContabil: '0,00',
                valor: '0,00',
                outras: '0,00',
                fornecedor: altMatch[6]?.trim() || '',
                uf: altMatch[7]?.trim() || '',
                tipoImposto: 'ISS',
                impostos: []
            };
        } catch (error) {
            console.warn('Erro ao processar linha alternativa:', line);
            return null;
        }
    }

    return null;
}

function processComplementaryLine(currentItem, line) {
    // Processa linhas de impostos complementares
    const impostoPatterns = [
        { pattern: /IRRF/, key: 'IRRF' },
        { pattern: /ISS RET/, key: 'ISS_RET' },
        { pattern: /CRF/, key: 'CRF' },
        { pattern: /INSS-RET/, key: 'INSS_RET' }
    ];

    for (const { pattern, key } of impostoPatterns) {
        if (pattern.test(line)) {
            // Extrai valor do imposto - padrão: número com vírgula no final da linha
            const valorMatch = line.match(/([\d.,]+)\s*$/);
            if (valorMatch && valorMatch[1]) {
                currentItem.impostos.push({
                    tipo: key,
                    valor: valorMatch[1].trim()
                });
            }
            break;
        }
    }
}

function extractLines(text) {
    if (!text || typeof text !== 'string') {
        console.warn("Texto vazio ou inválido para extração de linhas");
        return [];
    }

    return text
        .split("\n")
        .map((line) => line.trim())
        .filter((l) => l.length > 0);
}

// Função auxiliar para debug
export function debugStructuredData(data) {
    return data.map(item => ({
        codigo: item.codigoFornecedor,
        data: item.data,
        nota: item.notaSerie,
        fornecedor: item.fornecedor?.substring(0, 30),
        valorContabil: item.valorContabil,
        uf: item.uf
    }));
}