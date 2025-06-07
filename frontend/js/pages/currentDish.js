import { cartApi, currentDishApi } from "../api";
import { navigate } from "../router";

export const initCurrentDishPage = async (id) => {

  try {
    // Display loading state
    const currentDishSection = document.querySelector('.current-dish');
    if (currentDishSection) {
      currentDishSection.innerHTML = '<div class="loader"></div>';
    }

    // Fetch current dish
    const currentDish = await currentDishApi.getCurrentDish(id);

    // Render currrent  dish
    if (currentDish) {
      currentDishSection.innerHTML = `
           <div data-dishid="${currentDish._id}" class="dish-card current-dish animate-fade-in">
             <div class="dish-image">
               <img src="${currentDish.image}" alt="${currentDish.name}">
             </div>
             <div class="dish-content">
               <span class="dish-category">${currentDish.category}</span>
               <h3 class="dish-title">${currentDish.name}</h3>
               <p class="dish-description">${currentDish.description.length > 100 ? currentDish.description.substring(0, 100) + '...' : currentDish.description}</p>
               <p class="dish-price">₹ ${currentDish.price.toFixed(2)}</p>
                <button class="btn btn-accent add-to-cart-btn" data-id="${currentDish._id}">Add To Cart</button>

             </div>
            
           </div>
         `;
    } else if (currentDishSection) {
      currentDishSection.innerHTML = `
           <div class="container text-center">
             <p>No Current dish available at the moment.</p>
           </div>
         `;
    }

    // Add to Cart
    const addToCartBtn = currentDishSection.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const id = addToCartBtn.getAttribute('data-id');
          (async () => {
            const cartItem = await cartApi.addToCart(id)
            if (cartItem) {

              showMessage('item added to cart successful!', 'success');
              navigate("/cart")
            }

          })()
        }
        else {

          navigate("/login")
        }
      });
    }

  } catch (error) {
    console.error('Error initializing CurrentDish page:', error);

    // Display error message
    const currentDishSection = document.querySelector('.current-dish');
    if (currentDishSection) {
      currentDishSection.innerHTML = `
           <div class="alert alert-error">
             <p>Failed to load current dish. Please try again later.</p>
           </div>
         `;
    }
  }
}

// Function to show message
const showMessage = (message, type = 'success') => {
  const messageContainer = document.getElementById('add-to-cart-message');

  if (!messageContainer) return;

  // Create message element
  messageContainer.innerHTML = `
      <div class="alert alert-${type}">
        <p>${message}</p>
      </div>
    `;
};