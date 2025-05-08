import express, { RequestHandler } from "express";
import multer from "multer";
import * as evidenceCtrl from "../controllers/evidenceControllers";

// Configuração do multer para uploads em memória
const upload = multer({ storage: multer.memoryStorage() });

// Criação do Router
const router = express.Router();

// Helper para forçar tipo de handler
const asHandler = (fn: any): RequestHandler => fn as unknown as RequestHandler;

// Rota para upload de imagem (campo 'file' no form-data)
router.post(
  "/upload",
  upload.single("file"),
  asHandler(evidenceCtrl.uploadImage)
);

// Rota para deletar imagem do Cloudinary e do banco
router.delete("/upload/:id", asHandler(evidenceCtrl.deleteImage));

// Rota para criar nova evidência
router.post("/", asHandler(evidenceCtrl.createEvidence));

// Rota para obter todas as evidências
router.get("/", asHandler(evidenceCtrl.getAllEvidences));

// Rota para obter evidência por ID
router.get("/:id", asHandler(evidenceCtrl.getEvidenceById));

// Rota para atualização completa de evidência
router.put("/:id", asHandler(evidenceCtrl.updateEvidence));

// Rota para atualização parcial de evidência
router.patch("/:id", asHandler(evidenceCtrl.patchEvidence));

// Rota para deletar evidência
router.delete("/:id", asHandler(evidenceCtrl.deleteEvidence));

// Exporta o router configurado
export default router;
