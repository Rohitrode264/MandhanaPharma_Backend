import { Category } from '../models/Category.model';
import { generateUniqueSlug } from '../utils/slugify';
import { ApiError } from '../utils/ApiError';

export class CategoryService {
  static async createCategory(data: any) {
    if (!data.name) {
      throw new ApiError(400, 'Name is required');
    }
    const slug = await generateUniqueSlug(Category, data.name);
    const category = await Category.create({ ...data, slug });
    return category;
  }

  static async getCategories(query: any = {}) {
    return await Category.find(query).sort({ name: 1, createdAt: -1 });
  }

  static async updateCategory(id: string, data: any) {
    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    if (data.name && data.name !== category.name) {
      data.slug = await generateUniqueSlug(Category, data.name, id);
    }
    Object.assign(category, data);
    await category.save();
    return category;
  }

  static async deleteCategory(id: string) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }
}
