import mongoose, { Document, Schema } from 'mongoose';
import formatDatePlugin from '../utils/formatDatePlugin';

interface IBodyLesion {
  partNumber: number;       // 1 a 61
  present: boolean;         // true = parte presente
  description: string;      // detalhes (vazio por padrão)
}

interface IToothStatus {
  toothNumber: number;      // 1 a 32
  present: boolean;         // true = dente presente
  description: string;      // detalhes (vazio por padrão)
}

export interface IVictim extends Document {
  nic: string;                     // Número de Identificação de Corpo (obrigatório)
  nome?: string;
  sexo?: 'Masculino' | 'Feminino' | 'Outro';
  corEtnia?: string;
  documento?: string;              // RG, CPF, Passaporte etc.
  dataNascimento?: Date;
  causaMorte: string;
  endereco?: string;
  bodyLesions: IBodyLesion[];
  odontogram: IToothStatus[];
  createdAt: Date;
  updatedAt: Date;
}
const BodyLesionSchema = new Schema<IBodyLesion>(
  {
    partNumber: { type: Number, required: true, min: 1, max: 61 },
    present:    { type: Boolean, default: true },
    description:{ type: String,  default: '' }
  },
  { _id: false }
);

const ToothStatusSchema = new Schema<IToothStatus>(
  {
    toothNumber:{ type: Number, required: true, min: 1, max: 32 },
    present:    { type: Boolean, default: true },
    description:{ type: String,  default: '' }
  },
  { _id: false }
);

const victimSchema = new Schema<IVictim>({
  nic:  { type: String, required: true, unique: true },
  nome: { type: String },
  sexo: { type: String, enum: ['Masculino','Feminino','Outro'] },
  corEtnia: { type: String },
  documento:    { type: String },
  dataNascimento:   { type: Date },
  endereco: { type: String },
  causaMorte: { type: String },
  bodyLesions: {
      type: [BodyLesionSchema],
      default: Array.from({ length: 61 }, (_, i) => ({
        partNumber: i + 1,
        present: true,
        description: ''
      }))
    },
  odontogram: {
      type: [ToothStatusSchema],
      default: Array.from({ length: 32 }, (_, i) => ({
        toothNumber: i + 1,
        present: true,
        description: ''
      }))
    }
}, {
  timestamps: true  // cria createdAt e updatedAt automaticamente
});

// Formata createdAt e updatedAt antes de converter em JSON
victimSchema.plugin(formatDatePlugin);

const VictimModel = mongoose.model<IVictim>('Victim', victimSchema);
export default VictimModel;