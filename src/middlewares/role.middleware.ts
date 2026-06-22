import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../constants/enums';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, `User role '${req.user?.role}' is not authorized to access this route`));
    }
    next();
  };
};
