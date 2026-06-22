import { User } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../constants/enums';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (id: string) => {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign({ id }, env.jwtSecret, options);
};

export class AuthService {
  static async setupFirstAdmin(data: any) {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      throw new ApiError(400, 'Setup already completed. Users exist in the system.');
    }
    const user = await User.create({
      email: data.email,
      password: data.password,
      role: UserRole.SUPERADMIN,
    });
    return user;
  }

  static async signupUser(data: any) {
    const exists = await User.findOne({ email: data.email });
    if (exists) {
      throw new ApiError(400, 'User already exists');
    }
    const user = await User.create({
      email: data.email,
      password: data.password,
      role: data.role || UserRole.VIEWER,
    });
    return user;
  }

  static async loginUser(data: any) {
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user || !(await user.matchPassword(data.password))) {
      throw new ApiError(401, 'Invalid email or password');
    }
    const token = generateToken(user.id);
    return { user, token };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'There is no user with that email address.');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${env.frontendUrl}/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ApiError(500, 'There was an error sending the email. Try again later!');
    }
  }

  static async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, 'Token is invalid or has expired');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return generateToken(user.id);
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await User.findById(userId).select('+password');
    if (!user || !(await user.matchPassword(currentPass))) {
      throw new ApiError(401, 'Current password is wrong');
    }
    user.password = newPass;
    await user.save();
    return generateToken(user.id);
  }
}
