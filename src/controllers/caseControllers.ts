import { Request, Response } from "express";
import mongoose from 'mongoose';
import axios, { AxiosResponse } from "axios";
import Case, { ICase } from "../models/Case";

// Interface para os dados esperados no corpo da requisição de criação de caso
interface CreateCaseBody {
  titulo: string;
  descricao: string;
  status: 'Aberto' | 'Em Análise' | 'Fechado'; // Use o enum do schema
  localizacao: string;
  dataAbertura?: Date | string; // Opcional (tem default no schema)
  responsavel: string; // ID do usuário (será convertido para ObjectId)
  causaMorte: string;
  instituicao: string;
  evidencias?: string[]; // IDs das evidências (opcional)
  relatorios?: string[]; // IDs dos relatórios (opcional)
}

// Interface para os dados esperados no corpo da requisição de atualização parcial
interface UpdateCaseBody {
  [key: string]: any; // Permite qualquer campo para atualização parcial
}

// Interface para a resposta da API Nominatim
interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export const createCase = async (
  req: Request<{}, {}, CreateCaseBody>,
  res: Response
): Promise<void> => {
  try {
    console.log(req.body);
    const {
      titulo,
      descricao,
      status,
      localizacao,
      responsavel,
      causaMorte,
      instituicao,
      evidencias = [],
      relatorios = [],
      dataAbertura,
    } = req.body;

       // Validação dos campos obrigatórios
       if (
        !titulo ||
        !descricao ||
        !status ||
        !localizacao ||
        !responsavel ||
        !causaMorte ||
        !instituicao
      ) {
        res.status(400).json({ message: "Campos obrigatórios faltando" });
        return;
      }
          // Converte strings para ObjectIds
    const evidenciasIds = evidencias.map(id => new mongoose.Types.ObjectId(id));
    const relatoriosIds = relatorios.map(id => new mongoose.Types.ObjectId(id));
    const responsavelId = new mongoose.Types.ObjectId(responsavel);

    const newCase = new Case({
      titulo,
      descricao,
      status,
      localizacao,
      responsavel: responsavelId,
      causaMorte,
      instituicao,
      evidencias: evidenciasIds,
      relatorios: relatoriosIds,
      dataAbertura: dataAbertura ? new Date(dataAbertura) : undefined,
    });
    
    await newCase.save();
    res.status(201).json(newCase);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao criar o caso", error: error.message });
  }
};

export const getAllCases = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cases: ICase[] = await Case.find();
    res.status(200).json(cases);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao obter casos", error: error.message });
  }
};

export const getCaseById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const caso: ICase | null = await Case.findById(req.params.id);
    if (!caso) {
      res.status(404).json({ message: "Caso não encontrado" });
      return;
    }
    res.status(200).json(caso);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao obter caso", error: error.message });
  }
};

export const updateCase = async (
  req: Request<{ id: string }, {}, UpdateCaseBody>,
  res: Response
): Promise<void> => {
  try {
    const caso: ICase | null = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!caso) {
      res.status(404).json({ message: "Caso não encontrado" });
      return;
    }
    res.status(200).json(caso);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar caso", error: error.message });
  }
};

export const patchCase = async (
  req: Request<{ id: string }, {}, UpdateCaseBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCase: ICase | null = await Case.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCase) {
      res.status(404).json({ message: "Caso não encontrado" });
      return;
    }

    res.status(200).json(updatedCase);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar o caso", error: error.message });
  }
};

export const deleteCase = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const caso: ICase | null = await Case.findByIdAndDelete(req.params.id);
    if (!caso) {
      res.status(404).json({ message: "Caso não encontrado" });
      return;
    }
    res.status(200).json({ message: "Caso deletado com sucesso" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao deletar caso", error: error.message });
  }
};

export const geocodeAddress = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const caseId = req.params.id; // Recebe o ID da URL

  try {
    // Busca o caso pelo ID
    const caso: ICase | null = await Case.findById(caseId);

    if (!caso) {
      res.status(404).json({ message: "Caso não encontrado." });
      return;
    }

    const endereco = caso.localizacao;

    console.log("Endereço do caso:", endereco);

    // Requisição para o Nominatim
    const response: AxiosResponse<NominatimResponse[]> = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: endereco,
          format: "json",
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          "User-Agent": "siop/1.0 (felipe1ricardo158@gmail.com)", // Cabeçalho correto
        },
      }
    );

    if (response.data.length > 0) {
      const { lat, lon, display_name } = response.data[0];
      res.status(200).json({
        latitude: lat,
        longitude: lon,
        endereco: display_name,
      });
    } else {
      res
        .status(404)
        .json({ message: "Endereço não encontrado no Nominatim." });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao consultar o Nominatim ou buscar o caso.",
      error: error.message,
    });
  }
};

// Exportação como objeto para compatibilidade com a importação padrão
export default {
  createCase,
  getAllCases,
  getCaseById,
  updateCase,
  patchCase,
  deleteCase,
  geocodeAddress,
};
