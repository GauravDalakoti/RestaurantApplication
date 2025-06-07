import express from 'express';
import { addToCart, deleteCartItem, getCartItems } from "../controllers/cartController.js"
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id')
    .post(protect, addToCart)
    .delete(protect, deleteCartItem)

// .delete(protect, admin, deleteContactMessage);

router.route('/')
    .get(protect, getCartItems)

export default router;