import express from "express";
import multer from "multer";
import { uploadAndAnalyze } from "../controllers/fileControllers.js"

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });
router.post("/upload", upload.single("file"), uploadAndAnalyze);

export default router;