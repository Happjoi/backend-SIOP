import mongoose, { Document, Schema } from 'mongoose';
import formatDatePlugin from '../utils/formatDatePlugin';

export interface IMessage extends Document {
  caseId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

// Aplica plugin de formatação de data
messageSchema.plugin(formatDatePlugin);

const MessageModel = mongoose.model<IMessage>('Message', messageSchema);
export default MessageModel; 