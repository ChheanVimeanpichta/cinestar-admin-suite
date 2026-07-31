import { NextFunction, Request, Response } from 'express';

export const validateRequest = (_schema: unknown) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    next();
  };
};
