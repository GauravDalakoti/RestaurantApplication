import { menuApi } from '../api.js';
import { navigate } from '../router.js';

export const initHomePage = async () => {

  try {
    // Display loading state
    const featuredSection = document.querySelector('.featured-dishes');
    if (featuredSection) {
      featuredSection.innerHTML = '<div class="loader"></div>';
    }

    // Fetch featured dishes
    const featuredDishes = await menuApi.getFeaturedItems();
    console.log(featuredDishes);

    featuredSection.addEventListener('click', function (e) {
      const card = e.target.closest('.dish-card');
      if (card) {
        const dishId = card.dataset.dishid;
        navigate(`/currentDish?dishId=${dishId}`)
      }
    });

    // Render featured dishes
    if (featuredSection && featuredDishes.length > 0) {
      featuredSection.innerHTML = featuredDishes.map(dish => `
        <div data-dishid="${dish._id}" class="dish-card animate-fade-in">
          <div class="dish-image">
            <img src="${dish.image}" alt="${dish.name}">
          </div>
          <div class="dish-content">
            <span class="dish-category">${dish.category}</span>
            <h3 class="dish-title">${dish.name}</h3>
            <p class="dish-description">${dish.description.length > 100 ? dish.description.substring(0, 100) + '...' : dish.description}</p>
            <p class="dish-price">₹ ${dish.price.toFixed(2)}</p>
          </div>
        </div>
      `).join('');
    } else if (featuredSection) {
      featuredSection.innerHTML = `
        <div class="container text-center">
          <p>No featured dishes available at the moment.</p>
        </div>
      `;
    }

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        heroSection.style.backgroundPositionY = `${scrollY * 0.5}px`;
      });
    }

    // Add scroll animations
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');

      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        // Check if element is in viewport
        if (elementTop < window.innerHeight && elementBottom > 0) {
          element.classList.add('animate-fade-in');
        }
      });
    };

    // Run once on page load
    animateOnScroll();

    // Add event listener for scroll
    window.addEventListener('scroll', animateOnScroll);

  } catch (error) {
    console.error('Error initializing home page:', error);

    // Display error message
    const featuredSection = document.querySelector('.featured-dishes');
    if (featuredSection) {
      featuredSection.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load featured dishes. Please try again later.</p>
        </div>
      `;
    }
  }
};