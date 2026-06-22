import { Router } from 'express';
import { createTag, getTags, updateTag, deleteTag } from '../controllers/tag.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { UserRole } from '../constants/enums';
import { createTagSchema, updateTagSchema } from '../validations/tag.validation';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER), getTags)
  .post(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR), validate(createTagSchema), createTag);

router
  .route('/:id')
  .patch(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR), validate(updateTagSchema), updateTag)
  .delete(authorize(UserRole.SUPERADMIN, UserRole.ADMIN), deleteTag);

export default router;
