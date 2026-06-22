import mongoose, { Document, Schema } from 'mongoose';
import { CategoryScope } from '../constants/enums';

export interface ICategory extends Document {
  name: string;
  slug: string;
  scope: CategoryScope;
  description?: string;
  parentCategory?: mongoose.Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    scope: {
      type: String,
      enum: Object.values(CategoryScope),
      required: true,
    },
    description: {
      type: String,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
