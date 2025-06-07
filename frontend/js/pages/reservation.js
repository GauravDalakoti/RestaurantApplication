import { reservationApi } from '../api.js';

export const initReservationPage = () => {
  // Get the reservation form
  const reservationForm = document.getElementById('reservation-form');
  
  if (!reservationForm) return;
  
  // Set min date to today
  const dateInput = document.getElementById('reservation-date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }
  
  // Handle form submission
  reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('reservation-name').value;
    const email = document.getElementById('reservation-email').value;
    const phone = document.getElementById('reservation-phone').value;
    const date = document.getElementById('reservation-date').value;
    const time = document.getElementById('reservation-time').value;
    const guests = document.getElementById('reservation-guests').value;
    const message = document.getElementById('reservation-message').value;
    
    // Basic form validation
    if (!name || !email || !phone || !date || !time || !guests) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }
    
    // Validate phone format (simple check)
    if (phone.length < 10) {
      showMessage('Please enter a valid phone number', 'error');
      return;
    }
    
    // Create reservation data object
    const reservationData = {
      name,
      email,
      phone,
      date,
      time,
      guests: parseInt(guests),
      message
    };
    
    try {
      // Show loading state
      const submitBtn = reservationForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Send reservation to API
      await reservationApi.createReservation(reservationData);
      
      // Show success message
      showMessage('Reservation submitted successfully! We will contact you to confirm your reservation.', 'success');
      
      // Reset form
      reservationForm.reset();
      
    } catch (error) {
      console.error('Reservation error:', error);
      
      // Show error message
      showMessage(error.message || 'Failed to submit reservation. Please try again later.', 'error');
      
    } finally {
      // Reset button state
      const submitBtn = reservationForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Make Reservation';
      submitBtn.disabled = false;
    }
  });
  
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
    
    // Scroll to message
    messageContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      messageContainer.innerHTML = '';
    }, 5000);
  };
};