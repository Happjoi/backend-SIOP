// src/types/express/index.d.ts
import type { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      /**
       * Preenchido pelo middleware de autenticação.
       * Tipamos como payload decodificado do JWT, que estende JwtPayload,
       * garantindo que você tenha acesso a `id` e `role`.
       */
      user?: JwtPayload & { id: string; role: string };
    }
  }
}

// Faz com que o TS trate este arquivo como módulo
export {};
