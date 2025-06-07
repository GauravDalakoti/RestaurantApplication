import MenuItem from '../models/menuModel.js';
import Reservation from '../models/reservationModel.js';
import Contact from '../models/contactModel.js';

// @desc    Get dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardMetrics = async (req, res) => {
  try {
    // Get counts
    const menuItemCount = await MenuItem.countDocuments();
    const reservationCount = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    const unreadMessages = await Contact.countDocuments({ read: false });
    
    // Get recent reservations
    const recentReservations = await Reservation.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get featured menu items
    const featuredItems = await MenuItem.find({ featured: true });
    
    // Get recent messages
    const recentMessages = await Contact.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get items by category counts
    const starters = await MenuItem.countDocuments({ category: 'Starters' });
    const mains = await MenuItem.countDocuments({ category: 'Mains' });
    const desserts = await MenuItem.countDocuments({ category: 'Desserts' });
    const drinks = await MenuItem.countDocuments({ category: 'Drinks' });
    
    res.json({
      menuItemCount,
      reservationCount,
      pendingReservations,
      unreadMessages,
      recentReservations,
      featuredItems,
      recentMessages,
      categoryCounts: {
        starters,
        mains,
        desserts,
        drinks
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};