import express, { Router } from "express";
import comparisonCtrl from '../controllers/comparisonResultControllers';
import authMidd from "../middlewares/auth";
import authorizeRole from '../middlewares/authorization';

const router: Router = express.Router();

const peritoRole = ["perito"];

// Apenas perito e assistente podem comparar odontogramas
router.post(
  '/victims',  authMidd as express.RequestHandler,
  authorizeRole(peritoRole),
  comparisonCtrl.compareVictimOdontograms
);

router.get('/:id', router.post(
  "/",
  authMidd as express.RequestHandler,
  authorizeRole(peritoRole), comparisonCtrl.getComparisonResultById));

router.put('/:id', router.post(
  "/",
  authMidd as express.RequestHandler,
  authorizeRole(peritoRole), comparisonCtrl.updateComparisonResult));

router.patch('/:id',router.post(
  "/",
  authMidd as express.RequestHandler,
  authorizeRole(peritoRole),  comparisonCtrl.patchComparisonResult));

router.delete('/:id', router.post(
  "/",
  authMidd as express.RequestHandler,
  authorizeRole(peritoRole), comparisonCtrl.deleteComparisonResult));



export default router;
