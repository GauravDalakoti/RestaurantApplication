import Reservation from '../models/reservationModel.js';

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Public
export const createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, message } = req.body;
    
    // Manual validation
    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }
    
    const reservation = new Reservation({
      name,
      email,
      phone,
      date,
      time,
      guests,
      message: message || ''
    });
    
    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).sort({ date: 1 });
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reservation by ID
// @route   GET /api/reservations/:id
// @access  Private/Admin
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
// @access  Private/Admin
export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const reservation = await Reservation.findById(req.params.id);
    
    if (reservation) {
      reservation.status = status || reservation.status;
      
      const updatedReservation = await reservation.save();
      res.json(updatedReservation);
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (reservation) {
      await reservation.deleteOne();
      res.json({ message: 'Reservation removed' });
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};