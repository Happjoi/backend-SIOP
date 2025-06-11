import { Router } from 'express';
import { generateReportForCase } from '../controllers/aiReportController';
import { generateLaudoForEvidence } from '../controllers/aiLaudoController';

const router = Router();

/**
 * → Gera (ou substitui) o Relatório do Case de id = caseId
 *   POST /api/ai/cases/:caseId/generate-report
 */
router.post('/cases/:caseId/generate-report', generateReportForCase);

/**
 * → Gera (ou substitui) o Laudo da Evidência de id = evidenceId
 *   POST /api/ai/evidences/:evidenceId/generate-laudo
 */
router.post('/evidences/:evidenceId/generate-laudo', generateLaudoForEvidence);

export default router;
