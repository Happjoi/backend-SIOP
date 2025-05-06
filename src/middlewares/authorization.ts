import { Request, Response, NextFunction } from 'express';

const authorizeRole = (roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Response => {
    const user = req.user as { id: string; role: string };

    if (!user?.role || !roles.includes(user.role)) {
      return res.status(403).json({
        message: 'Acesso negado. Você não tem permissão para esta ação.'
      });
    }

    next();
  };
};

export default authorizeRole;
