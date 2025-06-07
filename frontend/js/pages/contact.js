import { contactApi } from '../api.js';

export const initContactPage = () => {
  // Get the contact form
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;
  
  // Handle form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    // Basic form validation
    if (!name || !email || !subject || !message) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }
    
    // Create message data object
    const messageData = {
      name,
      email,
      subject,
      message
    };
    
    try {
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Send message to API
      await contactApi.sendMessage(messageData);
      
      // Show success message
      showMessage('Your message has been sent successfully! We will get back to you soon.', 'success');
      
      // Reset form
      contactForm.reset();
      
    } catch (error) {
      console.error('Contact error:', error);
      
      // Show error message
      showMessage(error.message || 'Failed to send message. Please try again later.', 'error');
      
    } finally {
      // Reset button state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Send Message';
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