import mongoose from 'mongoose';
import { Product } from '../models/Product.model';
import { generateUniqueSlug } from '../utils/slugify';
import { ApiError } from '../utils/ApiError';
import { ProductStatus } from '../constants/enums';

export class ProductService {
  static async createProduct(data: any, userId: string) {
    if (!data.name) throw new ApiError(400, 'Name is required');
    const slug = await generateUniqueSlug(Product, data.name);
    const product = await Product.create({
      ...data,
      slug,
      createdBy: userId,
      updatedBy: userId,
    });
    return product;
  }

  static async getProducts(query: any = {}) {
    const { page = 1, limit = 10, search, category, tags, productType, status, sort } = query;
    const filter: any = {};

    if (status) filter.status = status;
    if (category) filter.categories = category;
    if (productType) filter.productType = productType;
    if (tags) filter.tags = { $in: tags.split(',') };

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let sortOption: any = { createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split(':');
      sortOption = { [field]: order === 'asc' ? 1 : -1 };
    } else if (search) {
      sortOption = { score: { $meta: 'textScore' } };
    }

    const products = await Product.find(filter)
      .populate('categories', 'name slug scope')
      .populate('tags', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    return { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
  }

  static async getProductById(id: string) {
    const product = await Product.findById(id).populate('categories').populate('tags');
    if (!product) throw new ApiError(404, 'Product not found');
    return product;
  }

  static async getProductBySlug(slug: string, requirePublished = false) {
    const filter: any = { slug };
    if (requirePublished) {
      filter.status = ProductStatus.PUBLISHED;
    }
    const product = await Product.findOne(filter).populate('categories').populate('tags');
    if (!product) throw new ApiError(404, 'Product not found');
    return product;
  }

  static async updateProduct(id: string, data: any, userId: string) {
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, 'Product not found');

    if (data.name && data.name !== product.name) {
      data.slug = await generateUniqueSlug(Product, data.name, id);
    }

    data.updatedBy = userId;
    Object.assign(product, data);
    await product.save();
    return product;
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new ApiError(404, 'Product not found');
    return product;
  }

  static async changeStatus(id: string, status: ProductStatus, userId: string) {
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, 'Product not found');

    product.status = status;
    product.updatedBy = new mongoose.Types.ObjectId(userId) as any;
    if (status === ProductStatus.PUBLISHED) {
      product.publishedAt = new Date();
      product.publishedBy = new mongoose.Types.ObjectId(userId) as any;
    }

    await product.save();
    return product;
  }
}
