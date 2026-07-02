import mongoose, { Document, Schema } from 'mongoose';
import { ProductStatus, ProductType, ProductScope } from '../constants/enums';

interface IPackaging {
  size?: string;
  type?: string;
  unitCount?: number;
}

interface IPricing {
  currency?: string;
  salePrice?: number;
  mrp?: number;
  unitLabel?: string;
}

interface IInventory {
  isInStock: boolean;
  stockQty: number;
}

interface IImage {
  url: string;
  publicId?: string;
  alt?: string;
  isPrimary?: boolean;
}

interface IBrochure {
  url: string;
  publicId?: string;
}

interface IAdditionalSpec {
  label: string;
  value: string;
}

interface ISeo {
  title?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  genericName?: string;
  brandName?: string;
  categories: mongoose.Types.ObjectId[];
  tags: mongoose.Types.ObjectId[];
  productType: ProductType;
  scope: ProductScope;
  strength?: string;
  dosageForm?: string;
  composition?: string[];
  packaging?: IPackaging;
  manufacturer?: string;
  countryOfOrigin?: string;
  treatment?: string;
  description?: string;
  prescriptionRequired: boolean;
  minOrderQuantity?: number;
  pricing?: IPricing;
  inventory?: IInventory;
  images: IImage[];
  brochure?: IBrochure;
  additionalSpecs: IAdditionalSpec[];
  seo?: ISeo;
  status: ProductStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  publishedBy?: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    genericName: { type: String, trim: true },
    brandName: { type: String, trim: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    productType: { type: String, enum: Object.values(ProductType), required: true },
    scope: { type: String, enum: Object.values(ProductScope), required: true, default: ProductScope.DOMESTIC },
    strength: { type: String },
    dosageForm: { type: String },
    composition: [{ type: String }],
    packaging: {
      size: String,
      type: { type: String },
      unitCount: Number,
    },
    manufacturer: { type: String },
    countryOfOrigin: { type: String },
    treatment: { type: String },
    description: { type: String },
    prescriptionRequired: { type: Boolean, default: false },
    minOrderQuantity: { type: Number, default: 1 },
    pricing: {
      currency: { type: String, default: 'INR' },
      salePrice: Number,
      mrp: Number,
      unitLabel: String,
    },
    inventory: {
      isInStock: { type: Boolean, default: true },
      stockQty: { type: Number, default: 0 },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        alt: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    brochure: {
      url: String,
      publicId: String,
    },
    additionalSpecs: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    seo: {
      title: String,
      metaDescription: String,
      keywords: [String],
    },
    status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.DRAFT },
    publishedAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
ProductSchema.index({ slug: 1 });
ProductSchema.index({ categories: 1, status: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index(
  {
    name: 'text',
    genericName: 'text',
    brandName: 'text',
    treatment: 'text',
  },
  {
    weights: {
      name: 10,
      brandName: 8,
      genericName: 5,
      treatment: 2,
    },
  }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
