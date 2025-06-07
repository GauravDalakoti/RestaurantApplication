import { navigate } from "../router";

// Set up the header component
export const setupHeader = () => {
  const header = document.createElement('header');

  header.innerHTML = `
    <div class="header-container">
      <a href="/" class="logo">SpiceTrail Restaurant</a>
      <button class="mobile-menu-btn">
        <i class="fas fa-bars"></i>
      </button>
      <nav class="nav-links">
        <a href="/">Home</a>
        <a href="/menu">Menu</a>
        <a href="/reservation">Reservation</a>
        <a href="/contact">Contact</a>
        <a href="/about">About</a>
        <div class="auth-nav">
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </nav>
    </div>
  `;

  // Insert header at the beginning of the app container
  const appContainer = document.getElementById('app');
  appContainer.insertBefore(header, appContainer.firstChild);

  // Add event listener for mobile menu
  const mobileMenuBtn = header.querySelector('.mobile-menu-btn');
  const navLinks = header.querySelector('.nav-links');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Check if user is logged in and update nav
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    const authNav = header.querySelector('.auth-nav');

    authNav.innerHTML = `
      ${user.isAdmin ? '<a href="/admin">Admin Dashboard</a>' : '<a href="/cart" >DashBoard</a>'}
      
      <a href="#" id="logout-link">Logout</a>
    `;

    // Add event listener to logout link
    const logoutLink = document.getElementById('logout-link');
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove user from local storage
      localStorage.removeItem('user');
      // Redirect to home
      window.location.href = '/';
    });
  }
};