// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extende a interface Request para incluir o usuário decodificado
declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

/**
 * Middleware para verificar token JWT e autorizar acesso
 */
const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    return res.status(403).json({
      message: 'Token inválido.',
      error: (err as Error).message
    });
  }
};

export default authenticateToken;
