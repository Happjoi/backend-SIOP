import { CelebrateError, Segments } from 'celebrate';
import { Request, Response, NextFunction } from 'express';
import { ValidationErrorItem } from 'joi';

/**
 * Middleware para tratar erros de validação do Celebrate
 */
export function celebrateErrorHandler(
  err: CelebrateError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CelebrateError) {
    const bodyErrors = err.details.get(Segments.BODY);
    
    if (bodyErrors) {
      const details = bodyErrors.details.map((d: ValidationErrorItem) => ({
        message: d.message,
        path: d.path.join('.'),
      }));

      return res.status(400).json({ message: 'Erro de validação', details });
    }
  }

  next(err);
}
