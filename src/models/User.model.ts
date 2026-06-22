import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserRole } from '../constants/enums';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: UserRole;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.VIEWER,
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  const user = this as any;
  if (!user.isModified('password') || !user.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password as string, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password as string);
};

UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

export const User = mongoose.model<IUser>('User', UserSchema);
