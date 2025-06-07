import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getFeaturedItems
} from '../controllers/menuController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, admin, upload.single('image'), createMenuItem);

router.get('/featured', getFeaturedItems);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, admin, upload.single('image'), updateMenuItem)
  .delete(protect, admin, deleteMenuItem);

export default router;