// src/middlewares/logger.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Middleware responsável por registrar cada requisição ao servidor,
 * incluindo método, URL e tempo de resposta, para auditoria e monitoramento.
 */
const logger: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  console.log(`${req.method} ${req.url} – Iniciando`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} – Concluído em ${duration}ms`);
  });

  next();
};

export default logger;
