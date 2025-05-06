import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role: string };
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JwtPayload & { id: string; role: string };
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
