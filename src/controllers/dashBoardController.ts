import { Request, Response } from 'express';
import Case, { ICase } from '../models/Case';
import { IVictim } from '../models/Victim';

interface PopulatedCase extends Omit<ICase, 'vitima'> {
    vitima: IVictim;
}

export const filtrarCasosDinamico = async (req: Request, res: Response) => {
  try {
    const filters = req.body.filters || {};
    const groupBy: string = req.body.groupBy;

    const pipeline: any[] = [];

    if (Object.keys(filters).length) {
      pipeline.push({ $match: filters }); // $match é um operador que serve para filtrar os documentos que queremos
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

export const getCaseStats = async (req: Request, res: Response) => { // pega o total de casos criados no mês atual e no mês anterior e calcula a porcentagem de crescimento
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1); // pega o primeiro dia do mês atual
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1); // pega o primeiro dia do mês anterior
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // pega o último dia do mês anterior

    const currentMonthCount = await Case.countDocuments({
      createdAt: { $gte: currentMonthStart } // $gte é um operador que serve para filtrar os documentos que foram criados no mês atual
    });

    const previousMonthCount = await Case.countDocuments({
      createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd } // $lte é um operador que serve para filtrar os documentos que foram criados no mês anterior
    });

    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return 100; // se o mês anterior não tiver casos, retorna 100
      return ((current - previous) / previous) * 100; // calcula a porcentagem de crescimento
    };

    const growth = calculateGrowth(currentMonthCount, previousMonthCount);

    res.json({
      currentMonth: currentMonthCount,
      previousMonth: previousMonthCount,
      growth
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos casos:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas dos casos' });
  }
};

export const getAvaregeAge = async (req: Request, res: Response) => {
    try {
        const cases = (await Case.find().populate('vitima', 'dataNascimento')) as unknown as PopulatedCase[];
        const totalAge = cases.reduce((sum, current) => {
            if (!current.vitima?.dataNascimento) return sum;
            const birthDate = new Date(current.vitima.dataNascimento);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            return sum + age;
        }, 0);
        const averageAge = totalAge / cases.length;
        res.json({ averageAge });
    } catch (error) {
        console.error('Erro ao buscar a idade média dos casos:', error);
        res.status(500).json({ message: 'Erro ao buscar a idade média dos casos' });
    }
}

export const getAvaregeAgeByUser = async (req: Request, res: Response) => {
  try {
    const user = req.params.id;
    const cases = (await Case.find({ responsavel: user }).populate('vitima', 'dataNascimento')) as unknown as PopulatedCase[];
    const totalAge = cases.reduce((sum, current) => {
        if (!current.vitima?.dataNascimento) return sum;
        const birthDate = new Date(current.vitima.dataNascimento);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return sum + age;
    }, 0);
    const averageAge = totalAge / cases.length;
    res.json({ averageAge });
  } catch (error) {
    console.error('Erro ao buscar a idade média dos casos por usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar a idade média dos casos por usuário' });
  }
}