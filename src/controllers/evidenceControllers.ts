// src/controllers/evidenceControllers.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import EvidenceModel, { IEvidence } from '../models/Evidence';
import UserModel,     { IUser     } from '../models/User';
import CaseModel,     { ICase     } from '../models/Case';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import streamifier from 'streamifier';

/**
 * Extendemos Request para permitir file opcional do multer.
 */
interface UploadRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * POST /api/evidences/upload
 * Faz upload de imagem para o Cloudinary e cria uma Evidence.
 */
export const uploadImage = async (
  req: UploadRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1) Campos obrigatórios do corpo
    const { tipo, coletadoPor, vitima, categoria, origem, condicao, status, localizacao, observacoesTecnicas, descricaoDetalhada } = req.body;
    if (!req.file) {
      res.status(400).json({ message: 'Arquivo não enviado.' });
      return;
    }
    // 2) Conversão de IDs
    const objIdColetado = new mongoose.Types.ObjectId(coletadoPor);
    const objIdVitima   = new mongoose.Types.ObjectId(vitima);

    // 3) Upload ao Cloudinary
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'dontforensic' },
        (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err) return reject(err);
          resolve(result!);
        }
      );
      streamifier.createReadStream(req.file!.buffer).pipe(stream);
    });

    // 4) Criação do documento
    const newEv = await EvidenceModel.create({
      tipo,
      dataColeta:        new Date(),
      coletadoPor:       objIdColetado,
      imagemURL:         uploadResult.secure_url,
      publicId:          uploadResult.public_id,
      vitima:            objIdVitima,
      categoria,
      origem,
      condicao,
      status,
      localizacao,
      observacoesTecnicas,
      descricaoDetalhada,
      relatorios:        []
    } as Partial<IEvidence>);

    res.status(201).json(newEv);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/evidences/upload/:id
 * Deleta a imagem no Cloudinary e remove o documento Evidence.
 */
export const deleteImage = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ev = await EvidenceModel.findById(req.params.id);
    if (!ev || !ev.publicId) {
      res.status(404).json({ message: 'Evidência ou publicId não encontrado.' });
      return;
    }
    await cloudinary.uploader.destroy(ev.publicId);
    await EvidenceModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Imagem deletada com sucesso.' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/evidences
 * Cria uma evidência textual (sem imagem).
 */
export const createEvidence = async (
  req: Request<{}, {}, Partial<IEvidence> & { coletadoPor: string; vitima: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tipo, coletadoPor, vitima, categoria, origem, condicao, status, localizacao, conteudo, observacoesTecnicas, descricaoDetalhada } = req.body as any;

    // Conversão de IDs
    const objIdColetado = new mongoose.Types.ObjectId(coletadoPor);
    const objIdVitima   = new mongoose.Types.ObjectId(vitima);

    // Cria documento
    const newEv = await EvidenceModel.create({
      tipo,
      dataColeta:       new Date(),
      coletadoPor:      objIdColetado,
      conteudo,
      vitima:           objIdVitima,
      categoria,
      origem,
      condicao,
      status,
      localizacao,
      observacoesTecnicas,
      descricaoDetalhada,
      relatorios:       []
    } as Partial<IEvidence>);

    res.status(201).json(newEv);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/evidences
 * Lista todas as evidências.
 */
export const getAllEvidences = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const list = await EvidenceModel.find();
    if (!list.length) {
      res.status(404).json({ message: 'Nenhuma evidência encontrada.' });
      return;
    }
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/evidences/:id
 * Busca evidência por ID.
 */
export const getEvidenceById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ev = await EvidenceModel.findById(req.params.id);
    if (!ev) {
      res.status(404).json({ message: 'Evidência não encontrada.' });
      return;
    }
    res.status(200).json(ev);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/evidences/:id
 * Atualiza completamente a evidência.
 */
export const updateEvidence = async (
  req: Request<{ id: string }, {}, Partial<IEvidence>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ev = await EvidenceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!ev) {
      res.status(404).json({ message: 'Evidência não encontrada.' });
      return;
    }
    res.status(200).json(ev);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/evidences/:id
 * Atualização parcial da evidência.
 */
export const patchEvidence = async (
  req: Request<{ id: string }, {}, Partial<IEvidence>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ev = await EvidenceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!ev) {
      res.status(404).json({ message: 'Evidência não encontrada.' });
      return;
    }
    res.status(200).json(ev);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/evidences/:id
 * Deleta evidência (sem imagem).
 */
export const deleteEvidence = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ev = await EvidenceModel.findByIdAndDelete(req.params.id);
    if (!ev) {
      res.status(404).json({ message: 'Evidência não encontrada.' });
      return;
    }
    res.status(200).json({ message: 'Evidência deletada com sucesso.' });
  } catch (err) {
    next(err);
  }
};

export default {
  uploadImage,
  deleteImage,
  createEvidence,
  getAllEvidences,
  getEvidenceById,
  updateEvidence,
  patchEvidence,
  deleteEvidence
};
