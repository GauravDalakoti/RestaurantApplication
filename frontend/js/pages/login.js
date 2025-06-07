import { loginUser } from '../auth.js';
import { navigate } from '../router.js';

export const initLoginPage = () => {
  // Get the login form
  const loginForm = document.getElementById('login-form');
  
  if (!loginForm) return;
  
  // Handle form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Basic form validation
    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    try {
      // Show loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Logging in...';
      submitBtn.disabled = true;
      
      // Login user
      const user = await loginUser(email, password);
      
      // Show success message
      showMessage('Login successful!', 'success');
      
      // Navigate to appropriate page based on role
      setTimeout(() => {
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Show error message
      showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
      
      // Reset button state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Login';
      submitBtn.disabled = false;
    }
  });
  
  // Function to show message
  const showMessage = (message, type = 'success') => {
    const messageContainer = document.getElementById('login-message');
    
    if (!messageContainer) return;
    
    // Create message element
    messageContainer.innerHTML = `
      <div class="alert alert-${type}">
        <p>${message}</p>
      </div>
    `;
  };
};