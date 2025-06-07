import { menuApi } from '../api.js';

export const initMenuPage = async () => {
  try {
    // Get elements
    const menuContainer = document.getElementById('menu-container');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Initial loading state
    if (menuContainer) {
      menuContainer.innerHTML = '<div class="loader"></div>';
    }
    
    // Fetch all menu items initially
    let menuItems = await menuApi.getMenuItems();
    
    // Render menu items
    const renderMenuItems = (items) => {
      if (items.length === 0) {
        menuContainer.innerHTML = '<p class="text-center">No items found in this category.</p>';
        return;
      }
      
      menuContainer.innerHTML = items.map(item => `
        <div class="dish-card animate-fade-in">
          <div class="dish-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="dish-content">
            <span class="dish-category">${item.category}</span>
            <h3 class="dish-title">${item.name}</h3>
            <p class="dish-description">${item.description}</p>
            <p class="dish-price">₹ ${item.price.toFixed(2)}</p>
          </div>
        </div>
      `).join('');
    };
    
    // Render the initial menu
    renderMenuItems(menuItems);
    
    // Add event listeners to category buttons
    categoryButtons.forEach(button => {
      button.addEventListener('click', async () => {
        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show loading
        menuContainer.innerHTML = '<div class="loader"></div>';
        
        // Get category
        const category = button.dataset.category;
        
        try {
          // Fetch menu items by category (or all if 'all' category)
          menuItems = category === 'all' 
            ? await menuApi.getMenuItems() 
            : await menuApi.getMenuItems(category);
          
          // Render the filtered menu
          renderMenuItems(menuItems);
        } catch (error) {
          console.error('Error fetching category items:', error);
          menuContainer.innerHTML = `
            <div class="alert alert-error">
              <p>Failed to load menu items. Please try again later.</p>
            </div>
          `;
        }
      });
    });
    
  } catch (error) {
    console.error('Error initializing menu page:', error);
    
    // Display error message
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
      menuContainer.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load menu items. Please try again later.</p>
        </div>
      `;
    }
  }
};