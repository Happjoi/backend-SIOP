import { Router } from 'express';
import victimController from '../controllers/victimControllers';


const router = Router();

// CRUD básico
router.post    ('/cases/:caseId',  victimController.createVictim);
router.get     ('/',            victimController.getAllVictims);
router.get     ('/:id',         victimController.getVictimById);
router.put     ('/:id',         victimController.updateVictim);
router.patch   ('/:id',         victimController.patchVictim);
router.delete  ('/:id',         victimController.deleteVictim);

// Atualizações de sub-documentos
router.patch   ('/:id/lesion',  victimController.updateBodyLesion);
router.patch   ('/:id/tooth',   victimController.updateToothStatus);

export default router;
