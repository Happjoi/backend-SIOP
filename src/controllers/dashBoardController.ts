import { Request, Response } from 'express';
import Case from '../models/Case';



export const filtrarCasosDinamico = async (req: Request, res: Response) => {
    try {
      const filters = req.body.filters || {};
      const groupBy: string = req.body.groupBy;
  
      const pipeline: any[] = [];
  
      if (Object.keys(filters).length) {
        pipeline.push({ $match: filters });
      }
  
      pipeline.push(
        {
          $lookup: { // lookup é basicamente um join em mysql e serve para relacionar os documentos (documentos são os dados que estão dentro do mongoDB) de evidencias e vitima com o caso
            from: 'evidences', // from é o nome da coleção que queremos relacionar
            localField: 'evidencias', // localField é o campo que queremos relacionar
            foreignField: '_id', // foreignField é o campo que queremos relacionar
            as: 'evidencias' // as é o nome do campo que queremos relacionar
          }
        },
        {
          $lookup: {
            from: 'victims',
            localField: 'vitima',
            foreignField: '_id',
            as: 'vitima'
          }
        },
        { $unwind: { path: '$vitima', preserveNullAndEmptyArrays: true } } // $unwind é um operador que serve para desmontar o array e criar um novo documento para cada elemento do array
      );
  
      // filtra campos relacionais
      const relationalFilters: any = {};
      for (const key in filters) {
        if (key.startsWith('evidencias.') || key.startsWith('vitima.')) {
          relationalFilters[key] = filters[key];
        }
      }
      if (Object.keys(relationalFilters).length > 0) {
        pipeline.push({ $match: relationalFilters });
      }
  
      // Agrupamento dinâmico para gráfico
      if (!groupBy) {
        return res.status(400).json({ erro: "O campo 'groupBy' é obrigatório" });
      }
  
      pipeline.push({
        $group: { 
          _id: `$${groupBy}`, // usamos dois $ para referenciar o campo do caso e o groupBy é o campo que queremos agrupar
          quantidade: { $sum: 1 }
        }
      });
  
      pipeline.push({
        $project: {
          _id: 0,
          categoria: { $ifNull: ["$_id", "não foi informado!"] },
          quantidade: 1
        }
      });
  
      pipeline.push({
        $sort: { quantidade: -1 }
      });
  
      const resultado = await Case.aggregate(pipeline);
  
      res.status(200).json(resultado);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao filtrar casos dinamicamente.' });
    }
  };
  