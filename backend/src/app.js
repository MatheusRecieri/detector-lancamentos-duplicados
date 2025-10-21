import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes.js"
import path from "path";

dotenv.config();

const API_BASE_URL = 'http://localhost:4000/api.js';
const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.search("/uploads", express.static(path.resolve("uploads")));
// app.use("/exports", express.static(path.resolve("exports")));

//rotaqs principais
app.use("/api/files", fileRoutes);

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  console.log('📦 Body:', req.body);
  console.log('📁 Files:', req.files);
  next();
});

app.get("/", (req, res) => {
  res.send("Servidor ativo e pronto!");
});

app.listen(PORT, () => {
    console.log(`Servidor roadando em http://localhost:${PORT}`);
});


export const fileService = {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro no upload do arquivo');
    }

    return await response.json();
  },

  // ✅ MÉTODO DIRETO - SEM COMPLICAÇÕES
  downloadExcel(processId) {
    return new Promise((resolve, reject) => {
      try {
        console.log(`🔗 Iniciando download para: ${processId}`);
        
        // Abrir URL de download em nova aba
        const downloadUrl = `${API_BASE_URL}/files/export/excel/${processId}`;
        window.open(downloadUrl, '_blank');
        
        console.log('✅ Download iniciado em nova aba');
        resolve(true);
        
      } catch (error) {
        console.error('❌ Erro no download:', error);
        reject(error);
      }
    });
  }
};