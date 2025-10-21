import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

export async function readFileContent(filePath, mimeType) {

    try {

        //extrator de pdf
        if (mimeType.includes("pdf")) {
            const buffer = await fs.readFile(filePath);
            const parser = new PDFParse({ data:buffer })
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

    for (const line of lines) {
        // Ignora cabeçalhos, rodapés e linhas irrelevantes
        if (isHeaderLine(line) || isFooterLine(line) || !isDataLine(line)) {
            continue;
        }

        // Tenta extrair dados estruturados da linha
        const itemData = extractStructuredDataFromLine(line);
        
        if (itemData) {
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

    return structuredData;
}

function isHeaderLine(line) {
    const headerPatterns = [
        /POSTO JUPITER LTDA/,
        /ACOMPANHAMENTO DE ENTRADAS/,
        /CNPJ:/,
        /Período:/,
        /Código Fornecedor/,
        /Data\s+Nota/,
        /Base Cálculo/
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
    return /^\d{3,4}\s/.test(line) || 
           // Ou são linhas de impostos complementares
           /^\s*(IRRF|ISS RET|CRF|INSS-RET)/.test(line) ||
           // Ou linhas com datas
           /\d{2}\/\d{2}\/\d{4}/.test(line);
}

function extractStructuredDataFromLine(line) {
    // Padrão para identificar linhas principais de dados
    const mainDataPattern = /^(\d{3,4})\s+([\d.,]+)\s+([\d.,]+)\s+(\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+([\d\s\w]+)\s+(\d+)\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)\s+(.+?)\s+([A-Z]{2})/;
    
    const match = line.match(mainDataPattern);
    
    if (match) {
        return {
            codigoFornecedor: match[1].trim(),
            baseCalculo: match[2].trim(),
            aliquota: match[3].trim(),
            isentas: match[4].trim(),
            data: match[5].trim(),
            notaSerie: match[6].trim(),
            especie: match[7].trim(),
            cfop: match[8].trim(),
            valorContabil: match[9].trim(),
            valor: match[10].trim(),
            outras: match[11].trim(),
            fornecedor: match[12].trim(),
            uf: match[13].trim(),
            tipoImposto: 'ISS', // padrão
            impostos: []
        };
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
            const valorMatch = line.match(/([\d.,]+)$/);
            if (valorMatch) {
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