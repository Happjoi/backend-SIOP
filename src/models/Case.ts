import mongoose, { Document, Schema } from 'mongoose';
import formatDatePlugin from '../utils/formatDatePlugin';

export interface ICase extends Document {
  titulo: string;
  descricao: string;
  status: 'Aberto' | 'Em Análise' | 'Fechado';
  localizacao: string;
  dataAbertura: Date;
  evidencias: mongoose.Types.ObjectId[];
  relatorios: mongoose.Types.ObjectId[];
  responsavel: mongoose.Types.ObjectId; 
  vitima: mongoose.Types.ObjectId;         
  causaMorte: string;
  instituicao: string;
  caseImageUrl?: string;
  caseImagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const caseSchema = new Schema<ICase>({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  status: { type: String, enum: ['Aberto', 'Em Análise', 'Fechado'], required: true },
  localizacao: { type: String, required: true },
  dataAbertura: { type: Date, default: Date.now },
  evidencias: [{ type: Schema.Types.ObjectId, ref: 'Evidence' }],
  relatorios: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
  responsavel: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vitima: [{ type: Schema.Types.ObjectId, ref: 'Victim', required: true }],
  causaMorte: { type: String, required: true },
  instituicao: { type: String, required: true },
  caseImageUrl:      { type: String },
  caseImagePublicId: { type: String }
}, { timestamps: true });

// Aplica plugin de formatação de data
caseSchema.plugin(formatDatePlugin);

// Cria e exporta o model
const CaseModel = mongoose.model<ICase>('Case', caseSchema);
export default CaseModel;
