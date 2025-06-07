import express from 'express';
import { 
  sendContactMessage, 
  getContactMessages, 
  getContactMessageById, 
  deleteContactMessage,
  markMessageAsRead
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(sendContactMessage)
  .get(protect, admin, getContactMessages);

router.route('/:id')
  .get(protect, admin, getContactMessageById)
  .delete(protect, admin, deleteContactMessage);

router.put('/:id/read', protect, admin, markMessageAsRead);

export default router;