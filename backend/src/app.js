import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes.js"
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.search("/uploads", express.static(path.resolve("uploads")));
app.use("/exports", express.static(path.resolve("exports")));

//rotaqs principais
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("Servidor ativo e pronto!");
});

app.listen(PORT, () => {
    console.log(`Servidor roadando em http://localhost:${PORT}`);
});