import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import VictimModel, { IVictim } from '../models/Victim';
import CaseModel from "../models/Case";

/**
 * Cria uma nova vítima
 */
export const createVictim = async (
  req: Request<{ caseId: string }, {}, IVictim>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { caseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      res.status(400).json({ message: "ID do caso inválido." });
      return;
    }

    const { nic, nome, sexo, corEtnia, documento, dataNascimento, endereco } = req.body;
    
    if (!nic) {
      res.status(400).json({ message: 'NIC é obrigatório' });
      return;
    }

    const exists = await VictimModel.findOne({ nic });
    if (exists) {
      res.status(409).json({ message: 'Vítima já cadastrada com este NIC' });
      return;
    }

    const newVictim = await VictimModel.create({
      nic,
      nome,
      sexo,
      corEtnia,
      documento,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
      endereco,
      caso: new mongoose.Types.ObjectId(caseId)
    });

    await CaseModel.findByIdAndUpdate(caseId, {
      $push: { vitimas: newVictim._id }
    });

    res.status(201).json(newVictim);
  } catch (err) {
    next(err);
  }
};
/**
 * Lista todas as vítimas
 */
export const getAllVictims = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const victims = await VictimModel.find();
    res.status(200).json(victims);
  } catch (err) {
    next(err);
  }
};

/**
 * Busca vítima por ID
 */
export const getVictimById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const victim = await VictimModel.findById(req.params.id);
    if (!victim) {
      res.status(404).json({ message: 'Vítima não encontrada.' });
      return;
    }
    res.status(200).json(victim);
  } catch (err) {
    next(err);
  }
};

/**
 * Substitui todos os campos da vítima (PUT)
 */
export const updateVictim = async (
  req: Request<{ id: string }, {}, Partial<IVictim> & { dataNascimento?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updateData: Partial<IVictim> = { ...req.body };
    if (req.body.dataNascimento) {
      updateData.dataNascimento = new Date(req.body.dataNascimento);
    }

    const victim = await VictimModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!victim) {
      res.status(404).json({ message: 'Vítima não encontrada.' });
      return;
    }
    res.status(200).json(victim);
  } catch (err) {
    next(err);
  }
};

/**
 * Atualização parcial da vítima (PATCH)
 */
export const patchVictim = async (
  req: Request<{ id: string }, {}, Partial<IVictim> & { dataNascimento?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updateData: Partial<IVictim> = { ...req.body };
    if (req.body.dataNascimento) {
      updateData.dataNascimento = new Date(req.body.dataNascimento);
    }

    const victim = await VictimModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!victim) {
      res.status(404).json({ message: 'Vítima não encontrada.' });
      return;
    }
    res.status(200).json(victim);
  } catch (err) {
    next(err);
  }
};

/**
 * Deleta uma vítima
 */
export const deleteVictim = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const victim = await VictimModel.findByIdAndDelete(req.params.id);
    if (!victim) {
      res.status(404).json({ message: 'Vítima não encontrada.' });
      return;
    }
    res.status(200).json({ message: 'Vítima deletada com sucesso.' });
  } catch (err) {
    next(err);
  }
};

/**
 * Atualiza uma lesão corporal específica
 */
export const updateBodyLesion = async (
  req: Request<{ id: string }, {}, { partNumber: number; present?: boolean; description?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { partNumber, present, description } = req.body;
    const updateFields: Record<string, any> = {};
    if (typeof present === 'boolean')       updateFields['bodyLesions.$.present']     = present;
    if (typeof description === 'string')    updateFields['bodyLesions.$.description'] = description;

    const result = await VictimModel.updateOne(
      { _id: req.params.id, 'bodyLesions.partNumber': partNumber },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Vítima ou parte corporal não encontrada.' });
      return;
    }

    res.status(200).json({ message: 'Lesão corporal atualizada.' });
  } catch (err) {
    next(err);
  }
};

/**
 * Atualiza o status de um dente específico
 */
export const updateToothStatus = async (
  req: Request<{ id: string }, {}, { toothNumber: number; present?: boolean; description?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { toothNumber, present, description } = req.body;
    const updateFields: Record<string, any> = {};
    if (typeof present === 'boolean')       updateFields['odontogram.$.present']     = present;
    if (typeof description === 'string')    updateFields['odontogram.$.description'] = description;

    const result = await VictimModel.updateOne(
      { _id: req.params.id, 'odontogram.toothNumber': toothNumber },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Vítima ou dente não encontrado.' });
      return;
    }

    res.status(200).json({ message: 'Status do dente atualizado.' });
  } catch (err) {
    next(err);
  }
};

export default {
  createVictim,
  getAllVictims,
  getVictimById,
  updateVictim,
  patchVictim,
  deleteVictim,
  updateBodyLesion,
  updateToothStatus,
};
