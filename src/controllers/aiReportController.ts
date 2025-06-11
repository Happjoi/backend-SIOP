// src/controllers/aiReportController.ts
import { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from 'mongoose';
import Case, { ICase } from '../models/Case';
import ReportModel, { IReport } from '../models/Report';
import { getGroqChatCompletion } from '../utils/llmClient';

export const generateReportForCase = async (
  req: Request<{ caseId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { caseId } = req.params;
    // 1) Busca o Case e “filtra” apenas os campos relevantes:
    const foundCase: ICase | null = await Case.findById(caseId)
      .select('titulo descricao status localizacao causaMorte instituicao vitima responsavel')
      .populate('vitima', 'nic nome sexo corEtnia')     // opcionalmente já “puxa” dados de vitima
      .populate('responsavel', 'nome email');           // opcionalmente “puxa” dados do perito/admis

    if (!foundCase) {
      res.status(404).json({ message: 'Case não encontrado.' });
      return;
    }

    // 2) Monta o JSON resumido para a LLM (sem timestamps, IDs de imagens etc)
    //    Você pode ajustar este objeto conforme o que realmente quer enviar ao prompt.
    const casePayload = {
      titulo:     foundCase.titulo,
      descricao:  foundCase.descricao,
      status:     foundCase.status,
      localizacao: foundCase.localizacao,
      causaMorte:  foundCase.causaMorte,
      instituicao: foundCase.instituicao,
      vitima:      foundCase.vitima,      // já populado (array de victims)
      responsavel: foundCase.responsavel, // já populado (objeto de usuário)
    };

    // 3) Constroi um prompt “genérico” (você vai preencher com seu texto mais detalhado depois)
    const prompt = 
         `
        ${JSON.stringify(casePayload, null, 2)}
        Você é um perito judicial responsável por elaborar um **relatório técnico** baseado em informações de um caso forense. Abaixo estão os dados do caso:



        Gere um relatório com a seguinte estrutura:
        1. **Identificação do Caso**: Título, status atual e localização.
        2. **Resumo do Caso**: Breve descrição do ocorrido e informações relevantes.
        3. **Detalhes da Vítima**: NIC, nome, sexo e etnia.
        4. **Responsável pelo Caso**: Nome completo e e-mail do perito responsável.
        5. **Análise Técnica**: Interpretação dos dados apresentados e possíveis implicações (ex: causa da morte, condições do local).
        6. **Conclusão**: Considerações finais com base nas informações fornecidas.

        Escreva de forma clara, formal, impessoal e objetiva. Utilize linguagem técnica e evite repetições. Este relatório pode ser incluído em um processo judicial, portanto, mantenha a coerência e profissionalismo.
        ;


      → Quando gerar, considere apenas as informações “essenciais” (ignorar createdAt, updatedAt, imagens etc).
      → O texto final deve ser um relatório bem organizado.  
    `;

    // 4) Chama a LLM
    const groqRes = await getGroqChatCompletion(prompt);
    if (!groqRes.choices?.length || groqRes.choices[0].message.content === null) {
      res.status(500).json({ message: 'Resposta inválida da LLM.' });
      return;
    }
    const generatedText: string = groqRes.choices[0].message.content;

    // 5) Verifica se já existe um Report ligado a este caseId → se sim, substitui; senão, cria
    const existingReport: IReport | null = await ReportModel.findOne({ casoRelacionado: caseId });

    if (existingReport) {
      existingReport.conteudo = generatedText;
      existingReport.dataCriacao = new Date();
      await existingReport.save();
      res.status(200).json({ message: 'Report existente substituído.', report: existingReport });
    } else {
      const payload: Partial<IReport> = {
        titulo:            `Relatório Gerado IA - ${foundCase.titulo}`,
        conteudo:          generatedText,
        peritoResponsavel: new Types.ObjectId(foundCase.responsavel!), // assume que “responsavel” é ObjectId
        dataCriacao:       new Date(),
        evidencias:        [],            
        casoRelacionado:   new Types.ObjectId(caseId),
      };
      const newReport = await ReportModel.create(payload);
      res.status(201).json({ message: 'Report criado pela IA.', report: newReport });
    }
  } catch (err) {
    next(err);
  }
};
