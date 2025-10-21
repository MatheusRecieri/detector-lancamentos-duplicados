import { readFileContent } from "../services/fileReaderService.js";
import { analyzeDuplicates } from "../services/analysisService.js";
import { exportToExcel } from "../services/exportExcelService.js";
import path from "path";

const analysisStorage = new Map();

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

    const processId = Date.now().toString();
    
    // Simulação de análise - SUBSTITUA pela sua lógica real
    const analysisResult = {
      success: true,
      processId: processId,
      filename: req.file.originalname,
      totalEntries: fileContent.length,
      possibleDuplicates: Math.max(1, Math.floor(fileContent.length * 0.1)), // 10% como exemplo
      duplicates: fileContent.slice(0, 3).map((line, index) => ({
        line: index + 1,
        description: line.substring(0, 50) + (line.length > 50 ? "..." : ""),
        value: parseFloat((Math.random() * 1000).toFixed(2))
      })),
      allEntries: fileContent.map((line, index) => ({
        line: index + 1,
        description: line.substring(0, 100),
        value: parseFloat((Math.random() * 500).toFixed(2)),
        status: index < 3 ? 'Duplicata' : 'Normal'
      })),
      message: 'Análise concluída com sucesso'
    };

    analysisStorage.set(processId, analysisResult);


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

export const exportToExcelController = async (req, res) => {
  try {
    const { processId } = req.params;
    
    console.log(`📥 Download solicitado para processId: ${processId}`);

    if (!processId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID do processo não fornecido' 
      });
    }

    // ✅ BUSCAR ANÁLISE DO ARMAZENAMENTO
    const analysisData = analysisStorage.get(processId);

    if (!analysisData) {
      return res.status(404).json({ 
        success: false, 
        error: 'Análise não encontrada. Faça upload do arquivo primeiro.' 
      });
    }

    console.log('📊 Dados encontrados para exportação:', {
      filename: analysisData.filename,
      totalEntries: analysisData.totalEntries,
      duplicates: analysisData.duplicates?.length
    });

    // ✅ USAR A FUNÇÃO exportToExcel DO SERVICE
    const excelBuffer = await exportToExcel(analysisData);

    console.log(`✅ Excel gerado: ${excelBuffer.length} bytes`);

    // ✅ HEADERS CRÍTICOS PARA DOWNLOAD
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="analise-duplicatas-${processId}.xlsx"`);
    res.setHeader('Content-Length', excelBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // ✅ CORS headers para garantir acesso
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    console.log(`📤 Enviando Excel para download...`);
    
    // ✅ Enviar arquivo
    res.send(excelBuffer);

  } catch (error) {
    console.error('❌ Erro na exportação:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};