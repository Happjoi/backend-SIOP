import { Router } from "express";
import {
  createEvidence,
  uploadImage,
  deleteImage,
  getAllEvidences,
  getEvidenceById,
  updateEvidence,
  patchEvidence,
  deleteEvidence,
  generateEvidencePDF, // Adicionada importação da nova função
} from "../controllers/evidenceControllers";
import "dotenv/config";
import upload from "../middlewares/upload";
import {
  validateCreateEvidence,
  validateUploadImage,
  validateId,
  validateUpdateEvidence,
  validatePatchEvidence,
} from "../middlewares/evidenceValidation";

const router = Router();

// Upload de imagem (chamada interna à createEvidence + uploadImage)
router.post(
  "/cases/:caseId/upload",
  upload.single("file"),
  validateUploadImage,
  uploadImage
);

// Deleta imagem
router.delete("/upload/:id", validateId, deleteImage);

// CRUD textual ou geral
router.post("/cases/:caseId", validateCreateEvidence, createEvidence);
router.get("/", getAllEvidences);
router.get("/:id", validateId, getEvidenceById);
router.put("/:id", validateId, validateUpdateEvidence, updateEvidence);
router.patch("/:id", validateId, validatePatchEvidence, patchEvidence);
router.delete("/:id", validateId, deleteEvidence);

// Geração de PDF do laudo (evidência)
router.get("/:id/pdf", validateId, generateEvidencePDF);

export default router;
