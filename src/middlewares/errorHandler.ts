// src/middlewares/errorHandler.ts
import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';

/**
 * Middleware centralizado de tratamento de erros.
 * Captura qualquer erro lançado nas rotas ou middlewares anteriores
 * e envia uma resposta padronizada ao cliente.
 */
const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Loga o stack trace do erro no console

  // Se o response já tiver sido iniciado, delega ao handler padrão
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: 'Algo deu errado.',
    error: err.message
  });
};

export default errorHandler;
