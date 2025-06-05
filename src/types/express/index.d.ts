import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ParamsDictionary } from 'express-serve-static-core';
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role: string };
      file?: Express.Multer.File;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    params: ParamsDictionary;
  }
}