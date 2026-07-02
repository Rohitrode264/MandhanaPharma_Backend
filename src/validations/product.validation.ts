import { z } from 'zod';
import { ProductStatus, ProductType, ProductScope } from '../constants/enums';

const packagingSchema = z.object({
  size: z.string().optional(),
  type: z.string().optional(),
  unitCount: z.number().optional(),
});

const pricingSchema = z.object({
  currency: z.string().optional(),
  salePrice: z.number().optional(),
  mrp: z.number().optional(),
  unitLabel: z.string().optional(),
});

const inventorySchema = z.object({
  isInStock: z.boolean().optional(),
  stockQty: z.number().optional(),
});

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

const additionalSpecSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const seoSchema = z.object({
  title: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    genericName: z.string().optional(),
    brandName: z.string().optional(),
    categories: z.array(z.string()).min(1, 'At least one Category ID is required'),
    tags: z.array(z.string()).optional(),
    productType: z.nativeEnum(ProductType),
    scope: z.nativeEnum(ProductScope).optional(),
    strength: z.string().optional(),
    dosageForm: z.string().optional(),
    composition: z.array(z.string()).optional(),
    packaging: packagingSchema.optional(),
    manufacturer: z.string().optional(),
    countryOfOrigin: z.string().optional(),
    treatment: z.string().optional(),
    description: z.string().optional(),
    prescriptionRequired: z.boolean().optional(),
    minOrderQuantity: z.number().optional(),
    pricing: pricingSchema.optional(),
    inventory: inventorySchema.optional(),
    images: z.array(imageSchema).optional(),
    brochure: z.object({ url: z.string().url(), publicId: z.string().optional() }).optional(),
    additionalSpecs: z.array(additionalSpecSchema).optional(),
    seo: seoSchema.optional(),
    status: z.nativeEnum(ProductStatus).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().optional(),
    genericName: z.string().optional(),
    brandName: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    productType: z.nativeEnum(ProductType).optional(),
    scope: z.nativeEnum(ProductScope).optional(),
    strength: z.string().optional(),
    dosageForm: z.string().optional(),
    composition: z.array(z.string()).optional(),
    packaging: packagingSchema.optional(),
    manufacturer: z.string().optional(),
    countryOfOrigin: z.string().optional(),
    treatment: z.string().optional(),
    description: z.string().optional(),
    prescriptionRequired: z.boolean().optional(),
    minOrderQuantity: z.number().optional(),
    pricing: pricingSchema.optional(),
    inventory: inventorySchema.optional(),
    images: z.array(imageSchema).optional(),
    brochure: z.object({ url: z.string().url(), publicId: z.string().optional() }).optional(),
    additionalSpecs: z.array(additionalSpecSchema).optional(),
    seo: seoSchema.optional(),
    status: z.nativeEnum(ProductStatus).optional(),
  }),
});

export const changeProductStatusSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    status: z.nativeEnum(ProductStatus),
  }),
});
