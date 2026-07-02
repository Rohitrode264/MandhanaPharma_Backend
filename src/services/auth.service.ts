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

    if (process.env.NODE_ENV !== 'production') {
      console.log('=============================================');
      console.log('🔐 PASSWORD RESET LINK (DEV/LOCAL MODE):');
      console.log(resetURL);
      console.log('=============================================');
    }

    const message = `Forgot your password? Submit a request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #1F2937; margin-bottom: 16px;">MandhanaPharma Password Reset</h2>
        <p style="color: #4B5563; line-height: 1.5;">You requested a password reset for your MandhanaPharma Catalog account. Click the button below to choose a new password:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 28px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(76, 175, 80, 0.2);">Reset Password</a>
        </div>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.5;">If the button above doesn't work, copy and paste the following link into your browser:<br/><a href="${resetURL}" style="color: #4CAF50; word-break: break-all;">${resetURL}</a></p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
        <p style="color: #9CA3AF; font-size: 12px;">This reset link expires in 10 minutes. If you did not request a password reset, please safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'MandhanaPharma - Password Reset Request',
        message,
        html,
      });
    } catch (err) {
      console.error('Email send failed:', err);
      if (process.env.NODE_ENV !== 'production') {
        // In dev mode, don't throw if SMTP fails so we can still test via console.log resetURL
        console.log('⚠️ Notice: SMTP send failed in dev mode, but reset token was generated. Use the URL printed above.');
        return;
      }
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ApiError(500, 'There was an error sending the email. Please check SMTP settings or try again later!');
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
