import { cartApi } from "../api";
import { navigate } from "../router";

export const initcartPage = async () => {

  try {
    // Display loading state
    const cartSection = document.querySelector('.cart-items');
    const cartSummary = document.querySelector(".cart-summary")
    if (cartSection) {
      cartSection.innerHTML = '<div class="loader"></div>';
    }

    // Fetch cart dishes
    const cartItems = await cartApi.getCartItems();
    console.log(cartItems);

    // calculate price
    let totalPrice = 0;
    cartItems.map((item) => totalPrice += item.price)

    // remove cart item
    document.addEventListener('click', async function (e) {
      if (e.target.classList.contains('remove-btn')) {
        const id = e.target.getAttribute("data-dishid");
        const response = await cartApi.deleteCartItem(id)

        if (response) {

          showMessage('cart item deleted successful!', 'success');
          navigate("/cart")
        }
        else {

          showMessage('something went wrong while deleting the cart item', 'error');
        }
      }
    });

    // Render featured dishes
    if (cartSection && cartItems.length > 0) {
      cartSection.innerHTML = cartItems.map(dish => `
        <div class="dish-card animate-fade-in cart-item">
          <div class="dish-image">
            <img src="${dish.image}" alt="${dish.name}">
          </div>
          <div class="dish-content">
            <span class="dish-category">${dish.category}</span>
            <h3 class="dish-title">${dish.name}</h3>
            <p class="dish-description">${dish.description.length > 100 ? dish.description.substring(0, 100) + '...' : dish.description}</p>
            <p class="dish-price">₹ ${dish.price.toFixed(2)}</p>
      
            <p class="quantity-wrapper">
              <button class="qty-btn decrement">−</button>
              <input type="number" class="qty-input" value="${1}" min="1">
              <button class="qty-btn increment">+</button>
            </p>

            <button data-dishid="${dish._id}" class="remove-btn">Remove</button>
          </div>
          
        </div>
        
      `).join('');

      // change quantity
      document.querySelectorAll('.cart-item').forEach(cartItem => {

        const price = cartItem.querySelector(".dish-price").innerHTML.split("₹")[1]
        console.log(price);

        const input = cartItem.querySelector('.qty-input');
        const incrementBtn = cartItem.querySelector('.increment');
        const decrementBtn = cartItem.querySelector('.decrement');

        incrementBtn.addEventListener('click', () => {
          let quantity = parseInt(input.value);
          totalPrice = totalPrice - parseFloat(price) * quantity
          input.value = parseInt(input.value) + 1;
          quantity = parseInt(input.value);
          totalPrice = totalPrice + parseFloat(price) * quantity;

          const cart_price = document.getElementById("cart-total")
          cart_price.innerHTML = totalPrice

        });

        decrementBtn.addEventListener('click', () => {
          let currentValue = parseInt(input.value);

          if (currentValue > 1) {
            input.value = currentValue - 1;
            totalPrice = totalPrice - parseFloat(price);

            const cart_price = document.getElementById("cart-total");
            // Format totalPrice: remove decimal if not needed
            cart_price.innerHTML = Number.isInteger(totalPrice) ? totalPrice : totalPrice.toFixed(2);
          }
        });

      });

      cartSummary.innerHTML = `<h3>Total Price: ₹ <span id="cart-total">${totalPrice}</span></h3>
                    <button class="checkout-btn">Proceed to Checkout</button>`


      const checkoutBtn = document.querySelector(".checkout-btn")
      checkoutBtn.addEventListener('click', function () {

        const checkout_detail = document.querySelector(".checkout-detail")
  
        checkout_detail.innerHTML = `
     
        <form class="checkout-content">
        <span class="close">&times;</span>
            <div class="section-title">
      <h2>checkout detail</h2>
    </div>
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" placeholder="John Doe" required />
      </div>

      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" placeholder="+91 9876543210" required />
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" placeholder="john@example.com" required />
      </div>

      <div class="form-group">
        <label for="address">Delivery Address</label>
        <textarea id="address" placeholder="123 Main Street, City, ZIP" required></textarea>
      </div>

      <div class="form-group">
        <label for="payment">Payment Method</label>
        <select id="payment" required>
          <option value="">Select</option>
          <option value="cash">Cash on Delivery</option>
          <option value="upi">UPI</option>
          <option value="card">Credit/Debit Card</option>
        </select>
      </div>

      <div class="form-group">
        <label for="notes">Order Notes (Optional)</label>
        <textarea id="notes" placeholder="Any special requests?"></textarea>
      </div>

      <button type="submit" class="checkout-btn">Place Order</button>
      
    </form>
        `;

        // Append modal to body
        document.body.appendChild(checkout_detail);

        // Show modal
        checkout_detail.style.display = 'block';

        // Add event listener to close button
        checkout_detail.querySelector('.close').addEventListener('click', () => {

          checkout_detail.style.display = 'none';
          document.body.removeChild(checkout_detail);
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
          if (e.target === checkout_detail) {
            checkout_detail.style.display = 'none';
            document.body.removeChild(checkout_detail);
          }
        });
      })

    } else if (cartSection) {
      cartSection.innerHTML = `
        <div class="container text-center">
          <p>No cart items available at the moment.</p>
        </div>
      `;
    }

  } catch (error) {
    console.error('Error initializing cart page:', error);

    // Display error message
    const cartSection = document.querySelector('.cart-items');
    if (cartSection) {
      cartSection.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load cart items. Please try again later.</p>
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