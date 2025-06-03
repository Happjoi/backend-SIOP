import { Request, Response } from "express";
import Report, { IReport } from "../models/Report";
import mongoose from "mongoose";
import CaseModel from "../models/Case";

// Interface para os dados esperados no corpo da requisição de criação de relatório
interface CreateReportBody {
  titulo: string;
  conteudo: string;
  peritoResponsavel: string;
  dataCriacao: Date | string;
  casoRelacionado: string;
}

// Interface para os dados esperados no corpo da requisição de atualização parcial
interface UpdateReportBody {
  [key: string]: any; // Permite qualquer campo para atualização parcial
}

export const createReport = async (
  req: Request<{ caseId: string }, {}, IReport>,
  res: Response
): Promise<void> => {
  try {
    const { caseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      res.status(400).json({ message: "ID do caso inválido." });
      return;
    }

    const { titulo, conteudo, peritoResponsavel, dataCriacao } = req.body;
    
    const newReport = new Report({
      titulo,
      conteudo,
      peritoResponsavel,
      dataCriacao: dataCriacao ? new Date(dataCriacao) : new Date(),
      casoRelacionado: new mongoose.Types.ObjectId(caseId)
    });

    await newReport.save();

    await CaseModel.findByIdAndUpdate(caseId, {
      $push: { relatorios: newReport._id }
    });

    res.status(201).json(newReport);
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao criar relatório",
      error: error.message
    });
  }
};

export const getAllReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reports: IReport[] = await Report.find();
    res.status(200).json(reports);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao obter relatórios", error: error.message });
  }
};

export const getReportById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const report: IReport | null = await Report.findById(req.params.id);
    if (!report) {
      res.status(404).json({ message: "Relatório não encontrado" });
      return;
    }
    res.status(200).json(report);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao obter relatório", error: error.message });
  }
};

export const updateReport = async (
  req: Request<{ id: string }, {}, UpdateReportBody>,
  res: Response
): Promise<void> => {
  try {
    const report: IReport | null = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!report) {
      res.status(404).json({ message: "Relatório não encontrado" });
      return;
    }
    res.status(200).json(report);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar relatório", error: error.message });
  }
};

export const patchReport = async (
  req: Request<{ id: string }, {}, UpdateReportBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const report: IReport | null = await Report.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!report) {
      res.status(404).json({ message: "Relatório não encontrado" });
      return;
    }

    res.status(200).json(report);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar relatório", error: error.message });
  }
};

export const deleteReport = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const report: IReport | null = await Report.findByIdAndDelete(
      req.params.id
    );
    if (!report) {
      res.status(404).json({ message: "Relatório não encontrado" });
      return;
    }
    res.status(200).json({ message: "Relatório deletado com sucesso" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao deletar relatório", error: error.message });
  }


  
};

// Exportação como objeto para compatibilidade com a importação padrão
export default {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  patchReport,
  deleteReport,
};
