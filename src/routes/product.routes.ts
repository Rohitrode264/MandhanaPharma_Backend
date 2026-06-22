import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  changeProductStatus,
} from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { UserRole } from '../constants/enums';
import {
  createProductSchema,
  updateProductSchema,
  changeProductStatusSchema,
} from '../validations/product.validation';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER), getProducts)
  .post(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR), validate(createProductSchema), createProduct);

router
  .route('/:id')
  .get(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER), getProductById)
  .patch(authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR), validate(updateProductSchema), updateProduct)
  .delete(authorize(UserRole.SUPERADMIN, UserRole.ADMIN), deleteProduct);

router
  .route('/:id/status')
  .patch(
    authorize(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR),
    validate(changeProductStatusSchema),
    changeProductStatus
  );

export default router;
