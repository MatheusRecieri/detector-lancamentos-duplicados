import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { buffer } from "stream/consumers";


export async function readFileContent(filePath, mimeType) {
    
    if (mimeType.includes("pdf")) {

        const buffer = await fs.readFile(filePath);
        
        const parser = new PDFParse({
            data: buffer
        });

        // const pdfParse = (await import('pdf-parse')).default;
        const data = await parser.getText()

        console.log(buffer);

        if (!data.text) {
            throw new Error("Não foi possível extrair texto do PDF");
        }

        return extractLines(data.text);
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
        const json = XLSX.utils.sheet_to_json;

        const text = json.map(row => 
                Array.isArray(row) ? row.join('\t') : String(row)
            ).join('\n');

        return json;
    }

    if (mimeType.includes("text")) {
        const data = await fs.readFile(filePath, "utf-8");

        return extractLines(data)
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