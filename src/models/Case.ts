import mongoose, { Document, Schema } from 'mongoose';
import formatDatePlugin from '../utils/formatDatePlugin';

export interface ICase extends Document {
  titulo: string;
  descricao: string;
  status: 'Aberto' | 'Em Análise' | 'Fechado';
  localizacao: string;
  dataAbertura: Date;
  dataFechamento?: Date;
  evidencias: mongoose.Types.ObjectId[];
  relatorios: mongoose.Types.ObjectId[];
  responsavel: mongoose.Types.ObjectId;          
  sexoVitima: 'Masculino' | 'Feminino' | 'Outro';
  corPele: string;
  causaMorte: string;
  instituicao: string;
  createdAt: Date;
  updatedAt: Date;
}

const caseSchema = new Schema<ICase>({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  status: { type: String, enum: ['Aberto', 'Em Análise', 'Fechado'], required: true },
  localizacao: { type: String, required: true },
  dataAbertura: { type: Date, default: Date.now },
  dataFechamento: { type: Date },
  evidencias: [{ type: Schema.Types.ObjectId, ref: 'Evidence' }],
  relatorios: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
  responsavel: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sexoVitima: { type: String, enum: ['Masculino', 'Feminino', 'Outro'], required: true },
  corPele: { type: String, required: true },
  causaMorte: { type: String, required: true },
  instituicao: { type: String, required: true }
}, { timestamps: true });

// Aplica plugin de formatação de data
caseSchema.plugin(formatDatePlugin);

// Cria e exporta o model
const CaseModel = mongoose.model<ICase>('Case', caseSchema);
export default CaseModel;
