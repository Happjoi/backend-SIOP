import mongoose, { Document, Schema } from 'mongoose';
import formatDatePlugin from '../utils/formatDatePlugin.js';

export interface IEvidence extends Document {
  tipo: 'Imagem' | 'Texto';
  dataColeta: Date;
  coletadoPor: mongoose.Types.ObjectId;

  // Campos para Imagem
  imagemURL?: string;
  publicId?: string;

  // Campos para Texto
  conteudo?: string;

  // Novos campos solicitados
  vitima: mongoose.Types.ObjectId;         // Referência ao caso vítima
  categoria: string;
  origem: string;
  condicao: 'Bem conservada' | 'Danificada' | 'Parcial' | string;
  status: 'Aberto' | 'Em Análise' | 'Fechado';
  localizacao: string;                    // Onde a evidência foi encontrada
  observacoesTecnicas?: string;
  descricaoDetalhada?: string;

  relatorios: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const evidenceSchema = new Schema<IEvidence>({
  tipo: { type: String, enum: ['Imagem', 'Texto'], required: true },
  dataColeta: { type: Date, default: Date.now },
  coletadoPor: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  imagemURL: { type: String },
  publicId: { type: String },
  conteudo: { type: String },

  vitima: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
  categoria: { type: String, required: true },
  origem: { type: String, required: true },
  condicao: { type: String, enum: ['Bem conservada', 'Danificada', 'Parcial'], required: true },
  status: { type: String, enum: ['Aberto', 'Em Análise', 'Fechado'], required: true },
  localizacao: { type: String, required: true },
  observacoesTecnicas: { type: String },
  descricaoDetalhada: { type: String },

  relatorios: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
}, { timestamps: true });

// Aplica plugin de formatação de data
evidenceSchema.plugin(formatDatePlugin);

// Cria e exporta o model
const EvidenceModel = mongoose.model<IEvidence>('Evidence', evidenceSchema);
export default EvidenceModel;
