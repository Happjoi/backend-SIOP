// src/controllers/aiLaudoController.ts
import { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from 'mongoose';
import Evidence, { IEvidence } from '../models/Evidence';
import { getGroqChatCompletion } from '../utils/llmClient';

export const generateLaudoForEvidence = async (
  req: Request<{ evidenceId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { evidenceId } = req.params;
    // 1) Busca a Evidência e “filtra” apenas os campos relevantes:
    const foundEv: IEvidence | null = await Evidence.findById(evidenceId)
      .select('tipo conteudo categoria origem condicao status localizacao observacoesTecnicas descricaoDetalhada coletadoPor vitima');

    if (!foundEv) {
      res.status(404).json({ message: 'Evidência não encontrada.' });
      return;
    }

    // 2) Monta o JSON resumido para a LLM (ignora timestamps, URLs etc)
    const evidencePayload = {
      tipo:             foundEv.tipo,
      conteudo:         foundEv.conteudo,
      categoria:        foundEv.categoria,
      origem:           foundEv.origem,
      condicao:         foundEv.condicao,
      status:           foundEv.status,
      localizacao:      foundEv.localizacao,
      observacoesTecnicas: foundEv.observacoesTecnicas,
      descricaoDetalhada:  foundEv.descricaoDetalhada,
      coletadoPor:      foundEv.coletadoPor, // ObjectId em string
      vitima:           foundEv.vitima,      // ObjectId em string
    };

    // 3) Monta o prompt (você pode personalizar a descrição depois)
    const prompt = 
      `
      ${JSON.stringify(evidencePayload, null, 2)}
      Você é um perito forense especialista em análise de evidências criminais. Com base nos dados fornecidos, redija um **laudo técnico** detalhado, claro e objetivo, sobre a evidência descrita a seguir:

      O laudo deve incluir:
      - Uma breve introdução com o tipo e origem da evidência;
      - A condição da evidência no momento da coleta;
      - Possíveis implicações técnicas ou forenses baseadas na descrição detalhada e observações técnicas;
      - Conclusão com hipóteses ou observações relevantes ao caso.

      Não use linguagem informal. O texto deve ser impessoal, técnico e em terceira pessoa. Ignore campos irrelevantes como timestamps ou IDs.
      ;
      
      → Considere apenas os campos “essenciais” acima para construir um laudo conciso.
      → O texto final deve explicar o estado da evidência, possíveis implicações, etc.
    `;

    // 4) Chama a LLM
    const groqRes = await getGroqChatCompletion(prompt);
    if (!groqRes.choices?.length || groqRes.choices[0].message.content === null) {
      res.status(500).json({ message: 'Resposta inválida da LLM.' });
      return;
    }
    const generatedLaudo: string = groqRes.choices[0].message.content;

    // 5) Atualiza o próprio documento Evidence com o laudo (substitui se já houver)
    foundEv.laudoConteudo = generatedLaudo;
    foundEv.laudoGeradoEm = new Date();
    await foundEv.save();

    res.status(200).json({ message: 'Laudo gerado pela IA e salvo.', laudoConteudo: generatedLaudo });
  } catch (err) {
    next(err);
  }
};
