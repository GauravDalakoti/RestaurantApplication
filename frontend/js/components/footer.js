// Set up the footer component
export const setupFooter = () => {
  const footer = document.createElement('footer');
  
  footer.innerHTML = `
    <div class="container">
      <div class="footer-container">
        <div class="footer-section">
          <h3>SpiceTrail Restaurant</h3>
          <p>A culinary journey through exquisite tastes and flavors. Our passion is creating memorable dining experiences.</p>
        </div>
        <div class="footer-section">
          <h3>Opening Hours</h3>
          <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
          <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
        </div>
        <div class="footer-section">
          <h3>Contact Us</h3>
          <p>123 Haldwani, Foodville</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@SpiceTrailrestaurant.com</p>
        </div>
        <div class="footer-section">
          <h3>Follow Us</h3>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-pinterest"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 SpiceTrail Restaurant. All rights reserved.</p>
      </div>
    </div>
  `;
  
  // Append footer to the app container
  document.getElementById('app').appendChild(footer);
};