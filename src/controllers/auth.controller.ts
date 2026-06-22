import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const setupAdmin = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.setupFirstAdmin(req.body);
  res.status(201).json(new ApiResponse(201, user, 'Superadmin setup successful'));
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.signupUser(req.body);
  res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await AuthService.loginUser(req.body);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json(new ApiResponse(200, { user, token }, 'Logged in successfully'));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req: any, res: Response) => {
  res.status(200).json(new ApiResponse(200, req.user, 'Current user'));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body.email);
  res.status(200).json(new ApiResponse(200, null, 'Token sent to email!'));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const token = await AuthService.resetPassword(req.params.resetToken as string, req.body.password);
  res.status(200).json(new ApiResponse(200, { token }, 'Password reset successful'));
});

export const changePassword = asyncHandler(async (req: any, res: Response) => {
  const token = await AuthService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.status(200).json(new ApiResponse(200, { token }, 'Password changed successfully'));
});
