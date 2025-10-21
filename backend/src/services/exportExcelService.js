import ExcelJS from "exceljs";
import path from "path";

export async function exportToExcel(result) {
    const workbook = new ExcelJS.Workbook();

    //aba principal
    const sheet = workbook.addWorksheet("Resumo");
    sheet.addRow(["Total de Notas", result.summary.total]);
    sheet.addRow(["Duplicatas", result.summary.duplicadas]);
    sheet.addRow(["Possiveis Duplicatas", result.summarypossiveisDuplicadas]);

    //Aba duplicatas
    const dupSheet = workbook.addWorksheet("Duplicatas");
    dupSheet.columns = [
        { header: "Fornecedor", key: "fornecedor"},
        { header: "Valor", key: "valor"},
    ]
    dupSheet.addRows(result.duplicatas);

    //aba de possiveis duplicatas
    const possiveisSheet = workbook.addWorksheet("Possiveis duplicatas");
    possiveisSheet.columns = [
        { header: "Fornecedor", key: "fornecedor"},
        { header: "Valor", key: "valor"},
    ]
    possiveisSheet.addRows(result.possiveisDuplicatas);

    const filename = `relatorio_${Date.now()}.xlsx`;
    const filePath = path.resolve("exports", filename);

    await workbook.xlsx.writeFile(filePath);

    return filePath;
}