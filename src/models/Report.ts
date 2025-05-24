import mongoose, { Document, Schema } from 'mongoose';
import formatDatePlugin from '../utils/formatDatePlugin';

export interface IReport extends Document {
  titulo: string;
  conteudo: string;
  peritoResponsavel: mongoose.Types.ObjectId;
  dataCriacao: Date;
  evidencias: mongoose.Types.ObjectId[];
  casoRelacionado: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>({
  titulo: { type: String, required: true },
  conteudo: { type: String, required: true },
  peritoResponsavel: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dataCriacao: { type: Date, default: Date.now },
  evidencias: [{ type: Schema.Types.ObjectId, ref: 'Evidence' }],
  casoRelacionado: { type: Schema.Types.ObjectId, ref: 'Case', required: true }
}, {
  timestamps: true  // adiciona createdAt e updatedAt automaticamente
});

// Aplica plugin de formatação de data
reportSchema.plugin(formatDatePlugin);

// Cria e exporta o model
const ReportModel = mongoose.model<IReport>('Report', reportSchema);
export default ReportModel;
