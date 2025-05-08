import { Request, Response, NextFunction, RequestHandler } from "express";

// Interface para o objeto user esperado em req.user
interface AuthUser {
  id: string;
  role: string;
}

// Extensão do Request para incluir a propriedade user
interface AuthRequest extends Request {
  user?: AuthUser;
}

// Middleware de autorização
const authorizeRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = req.user as AuthUser;

    if (!user?.role || !roles.includes(user.role)) {
      res.status(403).json({
        message: "Acesso negado. Você não tem permissão para esta ação.",
      });
      return;
    }

    next();
  };
};

export default authorizeRole;
