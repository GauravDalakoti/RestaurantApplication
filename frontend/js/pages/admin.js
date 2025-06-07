import { dashboardApi, menuApi, reservationApi, contactApi } from '../api.js';
import { isAdmin } from '../auth.js';
import { setupHeader } from '../components/header.js';
import { navigate } from '../router.js';

export const initAdminPage = async (template) => {
  // Check if user is admin
  if (!isAdmin()) {
    navigate('/login');
    return;
  }
  
  // Handle different admin pages
  if (template === '/pages/admin/dashboard.html') {
    initDashboard();
  } else if (template === '/pages/admin/menu.html') {
    initMenuManagement();
  } else if (template === '/pages/admin/reservations.html') {
    initReservationManagement();
  } else if (template === '/pages/admin/messages.html') {
    initMessageManagement();
  }
};

// Initialize dashboard
const initDashboard = async () => {
  try {
    // Show loading state
    const dashboardContent = document.querySelector('.dashboard-content');
    if (!dashboardContent) {
      dashboardContent.innerHTML = '<div class="loader"></div>';
    }
    
    // Fetch dashboard metrics
    const metrics = await dashboardApi.getMetrics();
    
    // Render dashboard statistics
    renderDashboardStats(metrics);
    
    // Render recent reservations
    renderRecentReservations(metrics.recentReservations);
    
    // Render recent messages
    renderRecentMessages(metrics.recentMessages);
    
  } catch (error) {
    console.error('Dashboard error:', error);
    
    // Show error message
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
      dashboardContent.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load dashboard. Please try again later.</p>
        </div>
      `;
    }
  }
};

// Render dashboard statistics
const renderDashboardStats = (metrics) => {
  const statsContainer = document.getElementById('dashboard-stats');
  
  if (!statsContainer) return;
  
  statsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">Menu Items</div>
        <div class="stat-value">${metrics.menuItemCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Total Reservations</div>
        <div class="stat-value">${metrics.reservationCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Pending Reservations</div>
        <div class="stat-value">${metrics.pendingReservations}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Unread Messages</div>
        <div class="stat-value">${metrics.unreadMessages}</div>
      </div>
    </div>
    
    <div class="section-title">
      <h3>Menu Items by Category</h3>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">Starters</div>
        <div class="stat-value">${metrics.categoryCounts.starters}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Mains</div>
        <div class="stat-value">${metrics.categoryCounts.mains}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Desserts</div>
        <div class="stat-value">${metrics.categoryCounts.desserts}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Drinks</div>
        <div class="stat-value">${metrics.categoryCounts.drinks}</div>
      </div>
    </div>
  `;
};

// Render recent reservations
const renderRecentReservations = (reservations) => {
  const reservationsContainer = document.getElementById('recent-reservations');
  
  if (!reservationsContainer) return;
  
  if (reservations.length === 0) {
    reservationsContainer.innerHTML = '<p>No recent reservations.</p>';
    return;
  }
  
  reservationsContainer.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Time</th>
          <th>Guests</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${reservations.map(reservation => `
          <tr>
            <td>${reservation.name}</td>
            <td>${new Date(reservation.date).toLocaleDateString()}</td>
            <td>${reservation.time}</td>
            <td>${reservation.guests}</td>
            <td>
              <span class="${getStatusClass(reservation.status)}">
                ${reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="text-right">
      <a href="/admin/reservations" class="btn btn-primary">View All Reservations</a>
    </div>
  `;
};

// Get CSS class for reservation status
const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed':
      return 'text-success';
    case 'cancelled':
      return 'text-error';
    default:
      return 'text-warning';
  }
};

// Render recent messages
const renderRecentMessages = (messages) => {
  const messagesContainer = document.getElementById('recent-messages');
  
  if (!messagesContainer) return;
  
  if (messages.length === 0) {
    messagesContainer.innerHTML = '<p>No recent messages.</p>';
    return;
  }
  
  messagesContainer.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Subject</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${messages.map(message => `
          <tr>
            <td>${message.name}</td>
            <td>${message.subject}</td>
            <td>${new Date(message.createdAt).toLocaleDateString()}</td>
            <td>${message.read ? 'Read' : '<span class="text-warning">Unread</span>'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="text-right">
      <a href="/admin/messages" class="btn btn-primary">View All Messages</a>
    </div>
  `;
};

// Initialize menu management
const initMenuManagement = async () => {
  try {
    // Show loading state
    const menuItemsContainer = document.getElementById('menu-items');
    if (menuItemsContainer) {
      menuItemsContainer.innerHTML = '<div class="loader"></div>';
    }
    
    // Fetch menu items
    const menuItems = await menuApi.getMenuItems();
    
    // Render menu items table
    renderMenuItems(menuItems);
    
    // Set up add item form
    setupAddItemForm();
    
  } catch (error) {
    console.error('Menu management error:', error);
    
    // Show error message
    const menuItemsContainer = document.getElementById('menu-items');
    if (menuItemsContainer) {
      menuItemsContainer.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load menu items. Please try again later.</p>
        </div>
      `;
    }
  }
};

// Render menu items table
const renderMenuItems = (items) => {
  const menuItemsContainer = document.getElementById('menu-items');
  
  if (!menuItemsContainer) return;
  
  if (items.length === 0) {
    menuItemsContainer.innerHTML = '<p>No menu items found.</p>';
    return;
  }
  
  menuItemsContainer.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Featured</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td><img src="${item.image}" alt="${item.name}" width="50"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.featured ? 'Yes' : 'No'}</td>
            <td>
              <button class="btn-edit" data-id="${item._id}">Edit</button>
              <button class="btn-delete" data-id="${item._id}">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  // Add event listeners for edit and delete buttons
  menuItemsContainer.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', () => {
      const itemId = button.dataset.id;
      editMenuItem(itemId, items.find(item => item._id === itemId));
    });
  });
  
  menuItemsContainer.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', async () => {
      const itemId = button.dataset.id;
      
      if (confirm('Are you sure you want to delete this menu item?')) {
        try {
          await menuApi.deleteMenuItem(itemId);
          
          // Refresh the menu items
          const updatedItems = await menuApi.getMenuItems();
          renderMenuItems(updatedItems);
          
          showMessage('Menu item deleted successfully', 'success');
        } catch (error) {
          console.error('Delete error:', error);
          showMessage('Failed to delete menu item', 'error');
        }
      }
    });
  });
};

// Set up add item form
const setupAddItemForm = () => {
  const addItemForm = document.getElementById('add-item-form');
  
  if (!addItemForm) return;
  
  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('item-name').value;
    const description = document.getElementById('item-description').value;
    const price = document.getElementById('item-price').value;
    const category = document.getElementById('item-category').value;
    const featured = document.getElementById('item-featured').checked;
    const imageInput = document.getElementById('item-image');
    
    // Basic validation
    if (!name || !description || !price || !category || !imageInput.files[0]) {
      showMessage('Please fill in all fields and select an image', 'error');
      return;
    }
    
    try {
      // Show loading state
      const submitBtn = addItemForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Adding...';
      submitBtn.disabled = true;
      
      // Create menu item
      await menuApi.createMenuItem({
        name,
        description,
        price: parseFloat(price),
        category,
        featured,
        image: imageInput.files[0]
      });
      
      // Reset form
      addItemForm.reset();
      
      // Show success message
      showMessage('Menu item added successfully', 'success');
      
      // Refresh the menu items
      const updatedItems = await menuApi.getMenuItems();
      renderMenuItems(updatedItems);
      
    } catch (error) {
      console.error('Add item error:', error);
      showMessage('Failed to add menu item', 'error');
    } finally {
      // Reset button state
      const submitBtn = addItemForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Add Menu Item';
      submitBtn.disabled = false;
    }
  });
};

// Edit menu item
const editMenuItem = (itemId, item) => {
  const addItemForm = document.getElementById('add-item-form');
  const formTitle = document.getElementById('form-title');
  
  if (!addItemForm || !formTitle) return;
  
  // Change form title
  formTitle.textContent = 'Edit Menu Item';
  
  // Populate form fields
  document.getElementById('item-name').value = item.name;
  document.getElementById('item-description').value = item.description;
  document.getElementById('item-price').value = item.price;
  document.getElementById('item-category').value = item.category;
  document.getElementById('item-featured').checked = item.featured;
  
  // Change submit button text
  const submitBtn = addItemForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Update Menu Item';
  
  // Set form data-id for update
  addItemForm.dataset.id = itemId;
  
  // Scroll to form
  addItemForm.scrollIntoView({ behavior: 'smooth' });
  
  // Change form submit handler
  addItemForm.onsubmit = async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('item-name').value;
    const description = document.getElementById('item-description').value;
    const price = document.getElementById('item-price').value;
    const category = document.getElementById('item-category').value;
    const featured = document.getElementById('item-featured').checked;
    const imageInput = document.getElementById('item-image');
    
    // Basic validation
    if (!name || !description || !price || !category) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }
    
    try {
      // Show loading state
      submitBtn.textContent = 'Updating...';
      submitBtn.disabled = true;
      
      // Create update data
      const updateData = {
        name,
        description,
        price: parseFloat(price),
        category,
        featured
      };
      
      // Add image if provided
      if (imageInput.files[0]) {
        updateData.image = imageInput.files[0];
      }
      
      // Update menu item
      await menuApi.updateMenuItem(itemId, updateData);
      
      // Reset form
      addItemForm.reset();
      
      // Show success message
      showMessage('Menu item updated successfully', 'success');
      
      // Refresh the menu items
      const updatedItems = await menuApi.getMenuItems();
      renderMenuItems(updatedItems);
      
      // Reset form to add mode
      formTitle.textContent = 'Add Menu Item';
      submitBtn.textContent = 'Add Menu Item';
      
      // Remove data-id
      delete addItemForm.dataset.id;
      
      // Reset submit handler
      setupAddItemForm();
      
    } catch (error) {
      console.error('Update item error:', error);
      showMessage('Failed to update menu item', 'error');
    } finally {
      // Reset button state
      submitBtn.textContent = 'Update Menu Item';
      submitBtn.disabled = false;
    }
  };
};

// Initialize reservation management
const initReservationManagement = async () => {
  try {
    // Show loading state
    const reservationsContainer = document.getElementById('reservations');
    if (reservationsContainer) {
      reservationsContainer.innerHTML = '<div class="loader"></div>';
    }
    
    // Fetch reservations
    const reservations = await reservationApi.getReservations();
    
    // Render reservations table
    renderReservations(reservations);
    
  } catch (error) {
    console.error('Reservation management error:', error);
    
    // Show error message
    const reservationsContainer = document.getElementById('reservations');
    if (reservationsContainer) {
      reservationsContainer.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load reservations. Please try again later.</p>
        </div>
      `;
    }
  }
};

// Render reservations table
const renderReservations = (reservations) => {
  const reservationsContainer = document.getElementById('reservations');
  
  if (!reservationsContainer) return;
  
  if (reservations.length === 0) {
    reservationsContainer.innerHTML = '<p>No reservations found.</p>';
    return;
  }
  
  reservationsContainer.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Date</th>
          <th>Time</th>
          <th>Guests</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${reservations.map(reservation => `
          <tr>
            <td>${reservation.name}</td>
            <td>${reservation.email}</td>
            <td>${reservation.phone}</td>
            <td>${new Date(reservation.date).toLocaleDateString()}</td>
            <td>${reservation.time}</td>
            <td>${reservation.guests}</td>
            <td>
              <span class="${getStatusClass(reservation.status)}">
                ${reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </span>
            </td>
            <td>
              <select class="status-select" data-id="${reservation._id}">
                <option value="pending" ${reservation.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="confirmed" ${reservation.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="cancelled" ${reservation.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  // Add event listeners for status dropdowns
  reservationsContainer.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async () => {
      const reservationId = select.dataset.id;
      const newStatus = select.value;
      
      try {
        await reservationApi.updateReservationStatus(reservationId, newStatus);
        
        // Update the status display
        const statusCell = select.parentElement.previousElementSibling;
        statusCell.innerHTML = `
          <span class="${getStatusClass(newStatus)}">
            ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
          </span>
        `;
        
        showMessage(`Reservation status updated to ${newStatus}`, 'success');
      } catch (error) {
        console.error('Status update error:', error);
        showMessage('Failed to update reservation status', 'error');
        
        // Reset the select to the previous value
        select.value = select.parentElement.previousElementSibling.textContent.trim().toLowerCase();
      }
    });
  });
};

// Initialize message management
const initMessageManagement = async () => {
  try {
    // Show loading state
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
      messagesContainer.innerHTML = '<div class="loader"></div>';
    }
    
    // Fetch messages
    const messages = await contactApi.getMessages();
    
    // Render messages table
    renderMessages(messages);
    
  } catch (error) {
    console.error('Message management error:', error);
    
    // Show error message
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
      messagesContainer.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load messages. Please try again later.</p>
        </div>
      `;
    }
  }
};

// Render messages table
const renderMessages = (messages) => {
  const messagesContainer = document.getElementById('messages');
  
  if (!messagesContainer) return;
  
  if (messages.length === 0) {
    messagesContainer.innerHTML = '<p>No messages found.</p>';
    return;
  }
  
  messagesContainer.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Subject</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${messages.map(message => `
          <tr class="${message.read ? '' : 'unread'}">
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${message.subject}</td>
            <td>${new Date(message.createdAt).toLocaleDateString()}</td>
            <td>${message.read ? 'Read' : '<span class="text-warning">Unread</span>'}</td>
            <td>
              <button class="btn-view" data-id="${message._id}">View</button>
              <button class="btn-mark-read" data-id="${message._id}" ${message.read ? 'disabled' : ''}>
                ${message.read ? 'Read' : 'Mark as Read'}
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  // Add event listeners for view buttons
  messagesContainer.querySelectorAll('.btn-view').forEach(button => {
    button.addEventListener('click', () => {
      const messageId = button.dataset.id;
      const message = messages.find(msg => msg._id === messageId);
      
      if (message) {
        // Create modal with message details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${message.subject}</h2>
            <p><strong>From:</strong> ${message.name} (${message.email})</p>
            <p><strong>Date:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
            <div class="message-body">
              <p>${message.message}</p>
            </div>
          </div>
        `;
        
        // Append modal to body
        document.body.appendChild(modal);
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listener to close button
        modal.querySelector('.close').addEventListener('click', () => {
          modal.style.display = 'none';
          document.body.removeChild(modal);
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.style.display = 'none';
            document.body.removeChild(modal);
          }
        });
        
        // Mark as read if not already
        if (!message.read) {
          contactApi.markAsRead(messageId)
            .then(() => {
              // Update UI
              const row = button.parentElement.parentElement;
              row.classList.remove('unread');
              
              const statusCell = row.querySelector('td:nth-child(5)');
              statusCell.textContent = 'Read';
              
              const markReadBtn = row.querySelector('.btn-mark-read');
              markReadBtn.disabled = true;
              markReadBtn.textContent = 'Read';
            })
            .catch(error => {
              console.error('Mark as read error:', error);
            });
        }
      }
    });
  });
  
  // Add event listeners for mark as read buttons
  messagesContainer.querySelectorAll('.btn-mark-read').forEach(button => {
    if (button.disabled) return;
    
    button.addEventListener('click', async () => {
      const messageId = button.dataset.id;
      
      try {
        await contactApi.markAsRead(messageId);
        
        // Update UI
        const row = button.parentElement.parentElement;
        row.classList.remove('unread');
        
        const statusCell = row.querySelector('td:nth-child(5)');
        statusCell.textContent = 'Read';
        
        button.disabled = true;
        button.textContent = 'Read';
        
        showMessage('Message marked as read', 'success');
      } catch (error) {
        console.error('Mark as read error:', error);
        showMessage('Failed to mark message as read', 'error');
      }
    });
  });
};

// Function to show message
const showMessage = (message, type = 'success') => {
  const messageContainer = document.getElementById('message-container');
  
  if (!messageContainer) return;
  
  // Create message element
  messageContainer.innerHTML = `
    <div class="alert alert-${type}">
      <p>${message}</p>
    </div>
  `;
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    messageContainer.innerHTML = '';
  }, 5000);
};