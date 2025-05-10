import mongoose, { Document, Schema } from 'mongoose';
import formatDatePlugin from '../utils/formatDatePlugin';

export interface IComparisonResult extends Document {
  resultado: string;
  precisao: number;
  analisadoPor: mongoose.Types.ObjectId;
  dataAnalise: Date;
  evidenciasEnvolvidas: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const comparisonResultSchema = new Schema<IComparisonResult>({
  resultado: { type: String, required: true },
  precisao: { type: Number, required: true },
  analisadoPor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dataAnalise: { type: Date, default: Date.now },
  evidenciasEnvolvidas: [{ type: Schema.Types.ObjectId, ref: 'Evidence' }]
}, {
  timestamps: true // adiciona createdAt e updatedAt automaticamente
});

// Aplica plugin de formatação de data
comparisonResultSchema.plugin(formatDatePlugin);

// Cria e exporta o model
const ComparisonResultModel = mongoose.model<IComparisonResult>('ComparisonResult', comparisonResultSchema);
export default ComparisonResultModel;
