import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import tagRoutes from './tag.routes';
import productRoutes from './product.routes';
import publicRoutes from './public.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/products', productRoutes);
router.use('/public', publicRoutes);
router.use('/upload', uploadRoutes);

export default router;
