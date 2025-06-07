import './style.css';
import { setupRouter } from './js/router.js';
import { setupHeader } from './js/components/header.js';
import { setupFooter } from './js/components/footer.js';
import { checkUserAuth } from './js/auth.js';

// Initialize the application
const initApp = async () => {
  // Check if user is logged in
  await checkUserAuth();
  
  // Set up header and footer
  setupHeader();
  setupFooter();
  
  // Set up router
  setupRouter();
};

// Run the app initialization
document.addEventListener('DOMContentLoaded', initApp);