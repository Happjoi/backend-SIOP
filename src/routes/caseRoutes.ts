import express, { Router } from "express";
import * as caseController from "../controllers/caseControllers";
import authMidd from "../middlewares/auth";
import authorizeRole from "../middlewares/authorization";

// Tipagem explícita para o roteador
const router: Router = express.Router();

// Rotas ordenadas para evitar conflitos:
// 1. Endpoint específico `/geo/:id`
router.get("/geo/:id", caseController.geocodeAddress);

// 2. Endpoints RESTful padrão
router.get("/", caseController.getAllCases);

router.get("/:id", caseController.getCaseById);

// Rotas protegidas (requer autenticação + autorização de "perito")
const peritoRole = ["perito"];

router.post(
  "/",
  authMidd as express.RequestHandler,
  authorizeRole(peritoRole),
  caseController.createCase
);

router.put(
  "/:id",
  authMidd as express.RequestHandler,
  authorizeRole(peritoRole),
  caseController.updateCase
);

router.patch(
  "/:id",
  authMidd as express.RequestHandler,
  authorizeRole(peritoRole),
  caseController.patchCase
);

router.delete(
  "/:id",
  authMidd as express.RequestHandler,
  authorizeRole(peritoRole),
  caseController.deleteCase
);

export default router;
