import MessageModel, { IMessage } from '../models/Message';
import CaseModel from '../models/Case';
import mongoose from 'mongoose';

class MessageService {
  // Verifica se o usuário tem permissão para acessar o chat do caso
  async canAccessCaseChat(userId: string, caseId: string): Promise<boolean> {
    try {
      const caseDoc = await CaseModel.findById(caseId);
      if (!caseDoc) return false;

      // Verifica se o usuário é o responsável pelo caso
      if (caseDoc.responsavel.toString() === userId) return true;

      // Verifica se o usuário é um perito ou assistente vinculado ao caso
      // Aqui você pode adicionar lógica adicional para verificar outros tipos de vínculos
      return false;
    } catch (error) {
      console.error('Erro ao verificar permissão de acesso ao chat:', error);
      return false;
    }
  }

  // Salva uma nova mensagem
  async saveMessage(caseId: string, senderId: string, content: string): Promise<IMessage> {
    try {
      const message = await MessageModel.create({
        caseId: new mongoose.Types.ObjectId(caseId),
        sender: new mongoose.Types.ObjectId(senderId),
        content
      });

      return message;
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      throw error;
    }
  }

  // Busca mensagens de um caso
  async getCaseMessages(caseId: string, limit: number = 50, skip: number = 0): Promise<IMessage[]> {
    try {
      const messages = await MessageModel.find({ caseId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'nome role')
        .exec();

      return messages.reverse(); // Retorna em ordem cronológica
    } catch (error) {
      console.error('Erro ao buscar mensagens do caso:', error);
      throw error;
    }
  }
}

export default new MessageService(); 