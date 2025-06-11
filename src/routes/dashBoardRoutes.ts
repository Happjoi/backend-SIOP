import { RequestHandler, Router } from 'express';
import { filtrarCasosDinamico, getAvaregeAge, getAvaregeAgeByUser, getCaseStats } from '../controllers/dashBoardController';

const router = Router();

router.post('/filtrar-casos-dinamico', filtrarCasosDinamico as RequestHandler);
router.get('/estatisticas-casos', getCaseStats as RequestHandler);
router.get('/media-idade', getAvaregeAge as RequestHandler);
router.get('/media-idade-usuario/:id', getAvaregeAgeByUser as RequestHandler);

export default router;