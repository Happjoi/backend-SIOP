import { Request, Response } from "express";
import Report, { IReport } from "../models/Report";
import mongoose from "mongoose";
import CaseModel from "../models/Case";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import util from "util";

// Configuração do Cloudinary (configure as variáveis de ambiente)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CreateReportBody {
  titulo: string;
  conteudo: string;
  peritoResponsavel: string;
  dataCriacao: Date | string;
  casoRelacionado: string;
}

interface UpdateReportBody {
  [key: string]: any;
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
      casoRelacionado: new mongoose.Types.ObjectId(caseId),
    });

    await newReport.save();

    await CaseModel.findByIdAndUpdate(caseId, {
      $push: { relatorios: newReport._id },
    });

    res.status(201).json(newReport);
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao criar relatório",
      error: error.message,
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

/**
 * Gera o PDF do relatório, envia para o Cloudinary e retorna a URL.
 */
export const generateReportPDF = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const report: IReport | null = await Report.findById(req.params.id);
    if (!report) {
      res.status(404).json({ message: "Relatório não encontrado" });
      return;
    }

    const doc = new PDFDocument({ margin: 50 });
    const fileName = `relatorio-${report._id}.pdf`;
    const filePath = path.join(__dirname, "..", "temp", fileName);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Conteúdo do PDF
    doc.fontSize(20).text("Relatório Pericial", { align: "center" }).moveDown();
    doc
      .fontSize(14)
      .text(`Caso Relacionado: ${report.casoRelacionado}`, { align: "center" })
      .moveDown();
    doc
      .text(`Gerado em: ${new Date().toLocaleDateString()}`, {
        align: "center",
      })
      .moveDown();

    doc
      .fontSize(16)
      .text("Detalhes do Relatório", { underline: true })
      .moveDown();
    doc.fontSize(12).text(`Título: ${report.titulo}`).moveDown();
    doc.text(`Perito Responsável: ${report.peritoResponsavel}`).moveDown();
    doc
      .text(
        `Data de Criação: ${new Date(report.dataCriacao).toLocaleDateString()}`
      )
      .moveDown();
    doc.text(`Caso Relacionado: ${report.casoRelacionado}`).moveDown();

    doc
      .fontSize(16)
      .text("Conteúdo do Relatório", { underline: true })
      .moveDown();
    doc.fontSize(12).text(report.conteudo, { align: "left" });

    doc.end();

    // Espera o fim da escrita do arquivo
    await new Promise<void>((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Upload para o Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "relatorios",
      public_id: `relatorio_${report._id}`,
      overwrite: true,
    });

    // Apaga o arquivo local
    await util.promisify(fs.unlink)(filePath);

    res.status(200).json({
      message: "PDF gerado e enviado para o Cloudinary com sucesso",
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao gerar e enviar PDF do relatório",
      error: error.message,
    });
  }
};

export default {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  patchReport,
  deleteReport,
  generateReportPDF,
};
