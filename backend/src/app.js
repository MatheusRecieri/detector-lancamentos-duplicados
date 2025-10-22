import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes.js"
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// CORREÇÃO: era app.search, agora é app.use
app.use("/uploads", express.static(path.resolve("uploads")));

// Middleware de log ANTES das rotas
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Rotas principais
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("Servidor ativo e pronto!");
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
