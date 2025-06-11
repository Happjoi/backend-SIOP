// src/controllers/comparisonResultController.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ComparisonResultModel, { IComparisonResult } from '../models/ComparisonResult';
import Victim, { IVictim } from '../models/Victim';

/**
 * POST /api/comparisons/victims
 * Compara odontogramas de duas vítimas e salva o resultado.
 */
export const compareVictimOdontograms = async (
  req: Request<{}, {}, { victimAId: string; victimBId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { victimAId, victimBId } = req.body;
    if (!mongoose.isValidObjectId(victimAId) || !mongoose.isValidObjectId(victimBId)) {
      res.status(400).json({ message: 'IDs de vítima inválidos.' });
      return;
    }

    const [vA, vB] = await Promise.all([
      Victim.findById(victimAId).lean<IVictim>(),
      Victim.findById(victimBId).lean<IVictim>()
    ]);
    if (!vA || !vB) {
      res.status(404).json({ message: 'Uma ou ambas as vítimas não foram encontradas.' });
      return;
    }

    const total = Math.min(vA.odontogram.length, vB.odontogram.length);
    let matches = 0;
    for (let i = 0; i < total; i++) {
      if (vA.odontogram[i].present === vB.odontogram[i].present) matches++;
    }
    const precision = parseFloat(((matches / total) * 100).toFixed(2));
    const resultado = `
Comparação Odontolegal:
- Total de dentes avaliados: ${total}
- Correspondências: ${matches}
- Grau de similaridade: ${precision}%
`;

    const newComp = await ComparisonResultModel.create({
      resultado: resultado.trim(),
      precisao: precision,
      analisadoPor: new mongoose.Types.ObjectId(req.user!.id),
      evidenciasEnvolvidas: [],  // opcional
    } as Partial<IComparisonResult>);

    res.status(201).json(newComp);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/comparisons
 * Lista todos os resultados de comparação.
 */
export const getAllComparisonResults = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const list = await ComparisonResultModel.find();
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/comparisons/:id
 * Busca um resultado de comparação por ID.
 */
export const getComparisonResultById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comp = await ComparisonResultModel.findById(req.params.id);
    if (!comp) {
      res.status(404).json({ message: 'Resultado de comparação não encontrado.' });
      return;
    }
    res.status(200).json(comp);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/comparisons/:id
 * Substitui completamente um resultado de comparação.
 */
export const updateComparisonResult = async (
  req: Request<{ id: string }, {}, Partial<IComparisonResult>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comp = await ComparisonResultModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!comp) {
      res.status(404).json({ message: 'Resultado de comparação não encontrado.' });
      return;
    }
    res.status(200).json(comp);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/comparisons/:id
 * Atualização parcial de um resultado de comparação.
 */
export const patchComparisonResult = async (
  req: Request<{ id: string }, {}, Partial<IComparisonResult>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comp = await ComparisonResultModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!comp) {
      res.status(404).json({ message: 'Resultado de comparação não encontrado.' });
      return;
    }
    res.status(200).json(comp);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/comparisons/:id
 * Remove um resultado de comparação.
 */
export const deleteComparisonResult = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comp = await ComparisonResultModel.findByIdAndDelete(req.params.id);
    if (!comp) {
      res.status(404).json({ message: 'Resultado de comparação não encontrado.' });
      return;
    }
    res.status(200).json({ message: 'Resultado de comparação deletado com sucesso.' });
  } catch (err) {
    next(err);
  }
};

export default {
  compareVictimOdontograms,
  getAllComparisonResults,
  getComparisonResultById,
  updateComparisonResult,
  patchComparisonResult,
  deleteComparisonResult,
};
