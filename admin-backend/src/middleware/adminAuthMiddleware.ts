import { NextFunction, Request, Response } from 'express';

export const adminAuthMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
