import { Request, Response } from "express";
import Evidence, { IEvidence } from "../models/Evidence";
import User, { IUser } from "../models/User";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import streamifier from "streamifier";

// Interface para os dados esperados no corpo da requisição de upload de imagem
interface UploadImageBody {
  coletadoPor: string;
  evidencias: string;
  tipo: string;
}

// Interface para os dados esperados no corpo da requisição de criação de evidência
interface CreateEvidenceBody {
  tipo: string;
  dataColeta: Date | string;
  coletadoPor: string;
  publicId?: string;
  imagemURL?: string;
  conteudo: string;
}

// Interface para os dados esperados no corpo da requisição de atualização parcial
interface UpdateEvidenceBody {
  [key: string]: any; // Permite qualquer campo para atualização parcial
}

// Extensão do Request para incluir req.file usando o tipo do Multer
interface UploadRequest extends Request<{}, {}, UploadImageBody> {
  file: Express.Multer.File;
}

export const uploadImage = async (
  req: UploadRequest,
  res: Response
): Promise<void> => {
  try {
    const { coletadoPor, evidencias, tipo } = req.body;
    console.log("req.file:", req.file); // Deve mostrar buffer, mimetype, etc
    console.log("req.body:", req.body); // Deve mostrar campos adicionais

    const streamUpload = (): Promise<UploadApiResponse> =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "dontforensic" },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    const newImage = await Evidence.create({
      imagemURL: result.secure_url,
      publicId: result.public_id,
      coletadoPor,
      evidencias,
      tipo,
    });

    res.status(201).json(newImage);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erro no upload de imagem", error: err.message });
  }
};

export const deleteImage = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const image: IEvidence | null = await Evidence.findById(id);
    if (!image) {
      res.status(404).json({ message: "Imagem não encontrada" });
      return;
    }

    // Verifica se publicId existe antes de tentar deletar no Cloudinary
    if (!image.publicId) {
      res
        .status(400)
        .json({ message: "Nenhum publicId associado a esta imagem" });
      return;
    }

    // Deleta do Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Deleta do MongoDB
    await Evidence.findByIdAndDelete(id);

    res.status(200).json({ message: "Imagem deletada com sucesso" });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao deletar imagem", error: error.message });
  }
};

export const createEvidence = async (
  req: Request<{}, {}, CreateEvidenceBody>,
  res: Response
): Promise<void> => {
  try {
    const { tipo, dataColeta, coletadoPor, publicId, imagemURL, conteudo } =
      req.body;
    const user: IUser | null = await User.findById(coletadoPor);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    const newEvidence = new Evidence({
      tipo,
      dataColeta,
      coletadoPor,
      publicId,
      imagemURL,
      conteudo,
    });
    await newEvidence.save();
    res.status(201).json(newEvidence);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao criar evidência", error: error.message });
  }
};

export const getAllEvidences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const evidences: IEvidence[] = await Evidence.find();
    if (!evidences || evidences.length === 0) {
      res.status(404).json({ message: "Nenhuma evidência encontrada" });
      return;
    }
    res.status(200).json(evidences);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao obter evidências", error: error.message });
  }
};

export const getEvidenceById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const evidence: IEvidence | null = await Evidence.findById(req.params.id);
    if (!evidence) {
      res.status(404).json({ message: "Evidência não encontrada" });
      return;
    }
    res.status(200).json(evidence);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao obter evidência", error: error.message });
  }
};

export const updateEvidence = async (
  req: Request<{ id: string }, {}, UpdateEvidenceBody>,
  res: Response
): Promise<void> => {
  try {
    const evidence: IEvidence | null = await Evidence.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!evidence) {
      res.status(404).json({ message: "Evidência não encontrada" });
      return;
    }
    res.status(200).json(evidence);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar evidência", error: error.message });
  }
};

export const patchEvidence = async (
  req: Request<{ id: string }, {}, UpdateEvidenceBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const evidence: IEvidence | null = await Evidence.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!evidence) {
      res.status(404).json({ message: "Evidência não encontrada" });
      return;
    }

    res.status(200).json(evidence);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar evidência", error: error.message });
  }
};

export const deleteEvidence = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const evidence: IEvidence | null = await Evidence.findByIdAndDelete(
      req.params.id
    );
    if (!evidence) {
      res.status(404).json({ message: "Evidência não encontrada" });
      return;
    }
    res.status(200).json({ message: "Evidência deletada com sucesso" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao deletar evidência", error: error.message });
  }
};

export default {
  createEvidence,
  getAllEvidences,
  getEvidenceById,
  updateEvidence,
  patchEvidence,
  deleteEvidence,
  uploadImage,
  deleteImage,
};
