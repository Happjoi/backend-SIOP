// src/middlewares/upload.ts
import multer, { StorageEngine, Multer } from 'multer';

/**
 * Configuração do Multer para armazenar arquivos em memória (buffer),
 * sem salvar em disco, ideal para upload direto ao Cloudinary.
 */
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage });

export default upload;
