import express from 'express';
import { 
  createReservation, 
  getReservations, 
  getReservationById, 
  updateReservationStatus, 
  deleteReservation 
} from '../controllers/reservationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createReservation)
  .get(protect, admin, getReservations);

router.route('/:id')
  .get(protect, admin, getReservationById)
  .put(protect, admin, updateReservationStatus)
  .delete(protect, admin, deleteReservation);

export default router;