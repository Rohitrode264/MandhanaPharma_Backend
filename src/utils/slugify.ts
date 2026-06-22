import slugify from 'slugify';
import mongoose from 'mongoose';

export const generateUniqueSlug = async (
  model: mongoose.Model<any>,
  name: string,
  excludeId?: string
): Promise<string> => {
  const baseSlug = slugify(name, { lower: true, strict: true, trim: true });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await model.findOne(query);
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
