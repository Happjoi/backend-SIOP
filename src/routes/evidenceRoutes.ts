import { Router } from 'express';
import {
  createEvidence,
  uploadImage,
  deleteImage,
  getAllEvidences,
  getEvidenceById,
  updateEvidence,
  patchEvidence,
  deleteEvidence
} from '../controllers/evidenceControllers';
import 'dotenv/config'
import upload from '../middlewares/upload';

const router = Router();

// Upload de imagem (chamada interna à createEvidence + uploadImage)
router.post('/upload', upload.single('file'), uploadImage);

// Deleta imagem
router.delete('/upload/:id', deleteImage);

// CRUD textual ou geral
router.post('/', createEvidence);
router.get('/', getAllEvidences);
router.get('/:id', getEvidenceById);
router.put('/:id', updateEvidence);
router.patch('/:id', patchEvidence);
router.delete('/:id', deleteEvidence);

export default router;
