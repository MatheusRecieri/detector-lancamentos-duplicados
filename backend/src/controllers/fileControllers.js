import { readFileContent } from "../services/fileReaderService.js";
import { analyzeDuplicates } from "../services/analysisService.js";
import { exportToExcel } from "../services/exportExcelService.js";
import path from "path";



export const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nenhum arquivo enviado' 
      });
    }

    console.log('Arquivo recebido:', req.file);

    // Processa o arquivo
    const fileContent = await readFileContent(req.file.path, req.file.mimetype);
    
    // Simulação de análise - SUBSTITUA pela sua lógica real
    const analysisResult = {
      success: true,
      totalEntries: fileContent.length,
      possibleDuplicates: Math.floor(fileContent.length * 0.1), // 10% como exemplo
      duplicates: fileContent.slice(0, 3).map((line, index) => ({
        line: index + 1,
        description: line.substring(0, 50) + '...',
        value: (Math.random() * 1000).toFixed(2)
      })),
      filename: req.file.originalname,
      processId: Date.now().toString(),
      message: 'Análise concluída com sucesso'
    };

    console.log('Enviando resposta para frontend:', analysisResult);

    // ✅ ENVIA RESPOSTA CORRETA PARA O FRONTEND
    res.json(analysisResult);

  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};