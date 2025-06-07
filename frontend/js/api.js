// API service for all backend requests
const API_URL = import.meta.env.VITE_API_URL;

// Get auth token
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

// Menu API
export const menuApi = {
  // Get all menu items
  getMenuItems: async (category = null) => {
    try {
      const url = category ? `${API_URL}/menu?category=${category}` : `${API_URL}/menu`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  // Get featured menu items
  getFeaturedItems: async () => {
    try {
      const response = await fetch(`${API_URL}/menu/featured`);

      if (!response.ok) {
        throw new Error('Failed to fetch featured items');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching featured items:', error);
      throw error;
    }
  },

  // Get menu item by ID
  getMenuItem: async (id) => {
    try {
      const response = await fetch(`${API_URL}/menu/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch menu item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  },

  // Create menu item (admin only)
  createMenuItem: async (menuData) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();

      // Append text fields
      formData.append('name', menuData.name);
      formData.append('description', menuData.description);
      formData.append('price', menuData.price);
      formData.append('category', menuData.category);

      if (menuData.featured !== undefined) {
        formData.append('featured', menuData.featured);
      }

      // Append image file
      if (menuData.image) {
        formData.append('image', menuData.image);
      }

      const response = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create menu item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  // Update menu item (admin only)
  updateMenuItem: async (id, menuData) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();

      // Append text fields
      if (menuData.name) formData.append('name', menuData.name);
      if (menuData.description) formData.append('description', menuData.description);
      if (menuData.price) formData.append('price', menuData.price);
      if (menuData.category) formData.append('category', menuData.category);
      if (menuData.featured !== undefined) formData.append('featured', menuData.featured);

      // Append image file
      if (menuData.image) {
        formData.append('image', menuData.image);
      }

      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update menu item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  // Delete menu item (admin only)
  deleteMenuItem: async (id) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete menu item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }
};

// Reservation API
export const reservationApi = {
  // Create a reservation
  createReservation: async (reservationData) => {
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create reservation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  // Get all reservations (admin only)
  getReservations: async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },

  // Update reservation status (admin only)
  updateReservationStatus: async (id, status) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update reservation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }
};

// Contact API
export const contactApi = {
  // Send contact message
  sendMessage: async (messageData) => {
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get all messages (admin only)
  getMessages: async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Mark message as read (admin only)
  markAsRead: async (id) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/contact/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to mark message as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
};

// Dashboard API (admin only)
export const dashboardApi = {
  // Get dashboard metrics
  getMetrics: async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }
};

// Current Dish Api

export const currentDishApi = {

  // Get Current Dish
  getCurrentDish: async (id) => {
    try {
      const response = await fetch(`${API_URL}/menu/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch menu item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  },
}

// cart Api

export const cartApi = {

  // add item to cart 
  addToCart: async (id) => {

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/cart/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add item to cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error while add the item to cart:', error);
      throw error;
    }
  },

  getCartItems: async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/cart/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  // Delete cart item 
  deleteCartItem: async (id) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete cart item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw error;
    }
  }
}