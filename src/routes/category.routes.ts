import { Router } from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { UserRole } from '../constants/enums';
import { createCategorySchema, updateCategorySchema } from '../validations/category.validation';

const router = Router();

// All routes here are for admin/editor
router.use(protect);

router
  .route('/')
  .get(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER), getCategories)
  .post(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR), validate(createCategorySchema), createCategory);

router
  .route('/:id')
  .patch(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR), validate(updateCategorySchema), updateCategory)
  .delete(authorize(UserRole.SUPERADMIN, UserRole.ADMIN), deleteCategory);

export default router;
