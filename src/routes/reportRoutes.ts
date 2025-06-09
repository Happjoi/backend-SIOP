import express, { Router } from "express";
import * as reportController from "../controllers/reportControllers";

// Tipagem explícita para o roteador
const router: Router = express.Router();

// Criar um novo relatório
router.post("/cases/:caseId", reportController.createReport);

// Obter todos os relatórios
router.get("/", reportController.getAllReports);

// Obter um relatório por ID
router.get("/:id", reportController.getReportById);

// Atualizar um relatório
router.put("/:id", reportController.updateReport);

// Atualizar recurso específico do relatório
router.patch("/:id", reportController.patchReport);

// Deletar um relatório
router.delete("/:id", reportController.deleteReport);

// Gera e retorna o PDF do relatório
router.get("/:id/pdf", reportController.generateReportPDF);

export default router;
