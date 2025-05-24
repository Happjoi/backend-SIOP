import mongoose, { Document, Schema } from 'mongoose';
import formatDatePlugin from '../utils/formatDatePlugin';

export interface IUser extends Document {
  nome: string;
  email: string;
  senha: string;
  role: 'perito' | 'admin' | 'assistente';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { type: String, enum: ['perito','admin','assistente'], required: true },

  // Campos para reset de senha:
  resetPasswordToken:    { type: String },
  resetPasswordExpires:  { type: Date }
}, {
  timestamps: true  // cria createdAt e updatedAt automaticamente
});

// Formata createdAt e updatedAt antes de converter em JSON
userSchema.plugin(formatDatePlugin);

const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;
