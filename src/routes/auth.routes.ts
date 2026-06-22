import { Router } from 'express';
import { setupAdmin, signup, login, logout, getMe, forgotPassword, resetPassword, changePassword } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import {
  setupAdminSchema,
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validations/auth.validation';

const router = Router();

router.post('/setup', validate(setupAdminSchema), setupAdmin);
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:resetToken', validate(resetPasswordSchema), resetPassword);
router.post('/change-password', protect, validate(changePasswordSchema), changePassword);

export default router;
