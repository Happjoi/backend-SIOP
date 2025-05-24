import express, { Router } from "express";
import comparisonResultController from "../controllers/comparasionResultControllers";

// Tipagem explícita para o roteador
const router: Router = express.Router();

// Criar um novo resultado de comparação
router.post("/", comparisonResultController.createComparisonResult);

// Obter todos os resultados de comparação
router.get("/", comparisonResultController.getAllComparisonResults);

// Obter resultado de comparação por ID
router.get("/:id", comparisonResultController.getComparisonResultById);

// Atualizar um resultado de comparação
router.put("/:id", comparisonResultController.updateComparisonResult);

// Atualizar recurso específico do resultado da comparação
router.patch("/:id", comparisonResultController.patchComparisonResult);

// Deletar um resultado de comparação
router.delete("/:id", comparisonResultController.deleteComparisonResult);

export default router;
