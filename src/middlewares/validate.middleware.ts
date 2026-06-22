import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: ZodObject<ZodRawShape>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => `${issue.path.join('.')} is ${issue.message}`);
        next(new ApiError(400, `Validation Failed: ${errorMessages.join(', ')}`));
      } else {
        next(error);
      }
    }
  };
};
