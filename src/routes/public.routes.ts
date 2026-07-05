import { Router } from 'express';
import {
  getPublicCategories,
  getPublicTags,
  getPublicProducts,
  getPublicProductBySlug,
  getPublicDosageForms,
} from '../controllers/public.controller';

const router = Router();

router.get('/categories', getPublicCategories);
router.get('/tags', getPublicTags);
router.get('/products/dosage-forms', getPublicDosageForms);
router.get('/products', getPublicProducts);
router.get('/products/:slug', getPublicProductBySlug);

export default router;
