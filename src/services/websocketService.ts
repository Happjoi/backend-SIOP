import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { IUser } from '../models/User';
import { ICase } from '../models/Case';
import { websocketAuth } from '../middlewares/websocketAuth';
import messageService from './messageService';

interface ConnectedUser {
  userId: string;
  socketId: string;
  role: string;
  currentCase?: string;
}

class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, ConnectedUser> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3030',
        methods: ['GET', 'POST']
      }
    });

    this.io.use(websocketAuth);
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      const user = socket.data.user;
      console.log('Novo cliente conectado:', socket.id, user.nome);

      // Registrei o usuário conectado
      this.connectedUsers.set(socket.id, {
        userId: user.id.toString(),
        socketId: socket.id,
        role: user.role
      });

      // Entro em um caso
      socket.on('joinCase', async (caseId: string) => {
        try {
          // Verifica se o usuário tem permissão para acessar o chat
        //   const canAccess = await messageService.canAccessCaseChat(user.id.toString(), caseId);
          
        //   if (!canAccess) {
        //     socket.emit('error', { message: 'Você não tem permissão para acessar este chat' });
        //     return;
        //   }

          const connectedUser = this.connectedUsers.get(socket.id);
          if (connectedUser) {
            connectedUser.currentCase = caseId;
            socket.join(`case:${caseId}`);
            console.log(`Usuário ${user.nome} entrou no caso ${caseId}`);
            
            // Notifico outros usuários no mesmo caso
            this.io.to(`case:${caseId}`).emit('userJoined', {
              userId: user.id,
              nome: user.nome,
              role: user.role
            });

            // Envia o histórico de mensagens
            const messages = await messageService.getCaseMessages(caseId);
            socket.emit('messageHistory', messages);
          }
        } catch (error) {
          console.error('Erro ao entrar no caso:', error);
          socket.emit('error', { message: 'Erro ao entrar no chat do caso' });
        }
      });

      // Sair de um caso
      socket.on('leaveCase', (caseId: string) => {
        const connectedUser = this.connectedUsers.get(socket.id);
        if (connectedUser) {
          connectedUser.currentCase = undefined;
          socket.leave(`case:${caseId}`);
          console.log(`Usuário ${user.nome} saiu do caso ${caseId}`);
          
          // Notifica outros usuários no mesmo caso
          this.io.to(`case:${caseId}`).emit('userLeft', {
            userId: user.id,
            nome: user.nome,
            role: user.role
          });
        }
      });

      // Enviar mensagem para um caso
      socket.on('sendMessage', async (data: { caseId: string; message: string }) => {
        try {
          const connectedUser = this.connectedUsers.get(socket.id);
          if (connectedUser) {
            // Salva a mensagem no banco de dados
            const savedMessage = await messageService.saveMessage(
              data.caseId,
              user.id.toString(),
              data.message
            );

            // Emite a mensagem para todos os usuários no caso
            this.io.to(`case:${data.caseId}`).emit('newMessage', {
              _id: savedMessage._id,
              caseId: savedMessage.caseId,
              sender: {
                _id: user.id,
                nome: user.nome,
                role: user.role
              },
              content: savedMessage.content,
              createdAt: savedMessage.createdAt
            });
          }
        } catch (error) {
          console.error('Erro ao enviar mensagem:', error);
          socket.emit('error', { message: 'Erro ao enviar mensagem' });
        }
      });

      // Atualização de status do caso
      socket.on('caseStatusUpdate', (data: { caseId: string; status: string }) => {
        const connectedUser = this.connectedUsers.get(socket.id);
        if (connectedUser && (user.role === 'perito' || user.role === 'admin')) {
          this.io.to(`case:${data.caseId}`).emit('statusUpdated', {
            caseId: data.caseId,
            status: data.status,
            updatedBy: user.id,
            updatedByName: user.nome,
            timestamp: new Date()
          });
        }
      });

      // Desconexão
      socket.on('disconnect', () => {
        const connectedUser = this.connectedUsers.get(socket.id);
        if (connectedUser) {
          if (connectedUser.currentCase) {
            this.io.to(`case:${connectedUser.currentCase}`).emit('userLeft', {
              userId: user.id,
              nome: user.nome,
              role: user.role
            });
          }
          this.connectedUsers.delete(socket.id);
          console.log(`Usuário desconectado: ${user.nome}`);
        }
      });
    });
  }

  // Método para emitir atualizações de caso para todos os usuários conectados
  public emitCaseUpdate(caseId: string, update: Partial<ICase>) {
    this.io.to(`case:${caseId}`).emit('caseUpdated', {
      caseId,
      update,
      timestamp: new Date()
    });
  }

  // Método para emitir novas evidências para todos os usuários no caso
  public emitNewEvidence(caseId: string, evidence: any) {
    this.io.to(`case:${caseId}`).emit('newEvidence', {
      caseId,
      evidence,
      timestamp: new Date()
    });
  }
}

export default WebSocketService; 