import { RequestHandler, Router } from 'express';
import { filtrarCasosDinamico } from '../controllers/dashBoardController';

const router = Router();

router.post('/filtrar-casos-dinamico', filtrarCasosDinamico as RequestHandler);

export default router;