import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

interface JWTPayload {
  id: string;
  role: string;
}

export const websocketAuth = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Token não fornecido'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JWTPayload;
    
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return next(new Error('Usuário não encontrado'));
    }

    // Adiciona o usuário ao objeto socket para uso posterior
    socket.data.user = {
      id: user._id,
      role: user.role,
      nome: user.nome
    };

    next();
  } catch (error) {
    next(new Error('Autenticação falhou'));
  }
}; 