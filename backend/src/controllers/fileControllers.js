import { readFileContent } from "../services/fileReaderService.js";
import { analyzeDuplicates } from "../services/analysisService.js";
import { exportToExcel } from "../services/exportExcelService.js";
import path from "path";


export async function uploadAndAnalyze(req, res) {
    try {
        if(!req.file){
            return res.status(400).json({error: "Nenhum arquivo enviado."})
        }

        const filePath = path.resolve(req.file.path)

        const data = await readFileContent(filePath, req.file.mimetype);

        const result = analyzeDuplicates(data);

        const excelPath = await exportToExcel(result);

        res.json({
            message: "Análise concluida com sucesso!",
            resumo: result.sumary,
            duplicatas: result.duplicatas,
            possiveisDuplicatas: result.possiveisDuplicatas,
            excelFile: `/exports/${path.basename(excelPath)}`,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao processar o arquivo."})
    }
}