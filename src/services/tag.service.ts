import { Tag } from '../models/Tag.model';
import { generateUniqueSlug } from '../utils/slugify';
import { ApiError } from '../utils/ApiError';

export class TagService {
  static async createTag(data: any) {
    if (!data.name) throw new ApiError(400, 'Name is required');
    const slug = await generateUniqueSlug(Tag, data.name);
    const tag = await Tag.create({ ...data, slug });
    return tag;
  }

  static async getTags(query: any = {}) {
    return await Tag.find(query).sort({ name: 1 });
  }

  static async updateTag(id: string, data: any) {
    const tag = await Tag.findById(id);
    if (!tag) throw new ApiError(404, 'Tag not found');
    if (data.name && data.name !== tag.name) {
      data.slug = await generateUniqueSlug(Tag, data.name, id);
    }
    Object.assign(tag, data);
    await tag.save();
    return tag;
  }

  static async deleteTag(id: string) {
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) throw new ApiError(404, 'Tag not found');
    return tag;
  }
}
