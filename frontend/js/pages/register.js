import { registerUser } from '../auth.js';
import { navigate } from '../router.js';

export const initRegisterPage = () => {
  // Get the register form
  const registerForm = document.getElementById('register-form');
  
  if (!registerForm) return;
  
  // Handle form submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Basic form validation
    if (!name || !email || !password || !confirmPassword) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    
    // Check password length
    if (password.length < 6) {
      showMessage('Password must be at least 6 characters long', 'error');
      return;
    }
    
    try {
      // Show loading state
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Registering...';
      submitBtn.disabled = true;
      
      // Register user
      await registerUser(name, email, password);
      
      // Show success message
      showMessage('Registration successful!', 'success');
      
      // Navigate to home page
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show error message
      showMessage(error.message || 'Registration failed. Please try again.', 'error');
      
      // Reset button state
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Register';
      submitBtn.disabled = false;
    }
  });
  
  // Function to show message
  const showMessage = (message, type = 'success') => {
    const messageContainer = document.getElementById('register-message');
    
    if (!messageContainer) return;
    
    // Create message element
    messageContainer.innerHTML = `
      <div class="alert alert-${type}">
        <p>${message}</p>
      </div>
    `;
  };
};