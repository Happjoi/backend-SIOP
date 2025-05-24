import multer, { StorageEngine, Multer } from 'multer';

// Armazena em memória (buffer) para enviar direto ao Cloudinary
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer        = multer({ storage });

export default upload;
