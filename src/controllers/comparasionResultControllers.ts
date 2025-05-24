import { Request, Response } from "express";
import ComparisonResult, {
  IComparisonResult,
} from "../models/ComparisonResult";

// Interface para os dados esperados no corpo da requisição de criação de resultado de comparação
interface CreateComparisonResultBody {
  resultado: string;
  precisao: number;
  analisadoPor: string;
  dataAnalise: Date | string;
  evidenciaTexto: string;
  evidenciaImagem: string;
}

// Interface para os dados esperados no corpo da requisição de atualização parcial
interface UpdateComparisonResultBody {
  [key: string]: any; // Permite qualquer campo para atualização parcial
}

export const createComparisonResult = async (
  req: Request<{}, {}, CreateComparisonResultBody>,
  res: Response
): Promise<void> => {
  try {
    const {
      resultado,
      precisao,
      analisadoPor,
      dataAnalise,
      evidenciaTexto,
      evidenciaImagem,
    } = req.body;
    const newComparisonResult = new ComparisonResult({
      resultado,
      precisao,
      analisadoPor,
      dataAnalise,
      evidenciaTexto,
      evidenciaImagem,
    });
    await newComparisonResult.save();
    res.status(201).json(newComparisonResult);
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao criar resultado de comparação",
      error: error.message,
    });
  }
};

export const getAllComparisonResults = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comparisonResults: IComparisonResult[] =
      await ComparisonResult.find();
    res.status(200).json(comparisonResults);
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao obter resultados de comparação",
      error: error.message,
    });
  }
};

export const getComparisonResultById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const comparisonResult: IComparisonResult | null =
      await ComparisonResult.findById(req.params.id);
    if (!comparisonResult) {
      res
        .status(404)
        .json({ message: "Resultado de comparação não encontrado" });
      return;
    }
    res.status(200).json(comparisonResult);
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao obter resultado de comparação",
      error: error.message,
    });
  }
};

export const updateComparisonResult = async (
  req: Request<{ id: string }, {}, UpdateComparisonResultBody>,
  res: Response
): Promise<void> => {
  try {
    const comparisonResult: IComparisonResult | null =
      await ComparisonResult.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    if (!comparisonResult) {
      res
        .status(404)
        .json({ message: "Resultado de comparação não encontrado" });
      return;
    }
    res.status(200).json(comparisonResult);
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao atualizar resultado de comparação",
      error: error.message,
    });
  }
};

export const patchComparisonResult = async (
  req: Request<{ id: string }, {}, UpdateComparisonResultBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const comparisonResult: IComparisonResult | null =
      await ComparisonResult.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });

    if (!comparisonResult) {
      res
        .status(404)
        .json({ message: "Resultado de comparação não encontrado" });
      return;
    }

    res.status(200).json(comparisonResult);
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao atualizar resultado de comparação",
      error: error.message,
    });
  }
};

export const deleteComparisonResult = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const comparisonResult: IComparisonResult | null =
      await ComparisonResult.findByIdAndDelete(req.params.id);
    if (!comparisonResult) {
      res
        .status(404)
        .json({ message: "Resultado de comparação não encontrado" });
      return;
    }
    res
      .status(200)
      .json({ message: "Resultado de comparação deletado com sucesso" });
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao deletar resultado de comparação",
      error: error.message,
    });
  }
};

// Exportação como objeto para compatibilidade com a importação padrão
export default {
  createComparisonResult,
  getAllComparisonResults,
  getComparisonResultById,
  updateComparisonResult,
  patchComparisonResult,
  deleteComparisonResult,
};
