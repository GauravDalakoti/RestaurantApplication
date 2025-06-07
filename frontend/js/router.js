// Simple router for SPA navigation
const routes = {
  '/': { title: 'Home', template: '/pages/home.html' },
  '/menu': { title: 'Menu', template: '/pages/menu.html' },
  '/reservation': { title: 'Reservation', template: '/pages/reservation.html' },
  '/contact': { title: 'Contact', template: '/pages/contact.html' },
  '/about': { title: 'About', template: '/pages/about.html' },
  '/login': { title: 'Login', template: '/pages/login.html' },
  '/currentDish': { title: 'CurrentDish', template: '/pages/currentDish.html' },
  '/register': { title: 'Register', template: '/pages/register.html' },
  '/cart': { title: 'cart', template: '/pages/cart.html', protected: true},
  '/admin': { title: 'Admin Dashboard', template: '/pages/admin/dashboard.html', protected: true, adminOnly: true },
  '/admin/menu': { title: 'Menu Management', template: '/pages/admin/menu.html', protected: true, adminOnly: true },
  '/admin/reservations': { title: 'Reservations', template: '/pages/admin/reservations.html', protected: true, adminOnly: true },
  '/admin/messages': { title: 'Messages', template: '/pages/admin/messages.html', protected: true, adminOnly: true }
};

// Load page content
const loadPage = async (url) => {
  const cleanPath = url.split('?')[0];
  const route = routes[cleanPath] || routes['/'];

  // Check if route is protected
  if (route.protected) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
      navigate('/login');
      return;
    }

    // Check if route is admin only
    if (route.adminOnly && !user.isAdmin) {
      navigate('/');
      return;
    }
  }

  try {
    const response = await fetch(route.template);

    if (!response.ok) {
      throw new Error('Page not found');
    }

    const html = await response.text();

    // Update the content
    document.querySelector('main').innerHTML = html;
    document.title = `${route.title} - Spice Trail`;

    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === url) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Initialize page-specific scripts
    if (route.template === '/pages/home.html') {
      import('./pages/home.js').then(module => module.initHomePage());
    } else if (route.template === '/pages/menu.html') {
      import('./pages/menu.js').then(module => module.initMenuPage());
    } else if (route.template === '/pages/reservation.html') {
      import('./pages/reservation.js').then(module => module.initReservationPage());
    } else if (route.template === '/pages/contact.html') {
      import('./pages/contact.js').then(module => module.initContactPage());
    } else if (route.template === '/pages/login.html') {
      import('./pages/login.js').then(module => module.initLoginPage());
    } else if (route.template === '/pages/register.html') {
      import('./pages/register.js').then(module => module.initRegisterPage());
    } else if (route.template.startsWith('/pages/admin/')) {
      import('./pages/admin.js').then(module => module.initAdminPage(route.template));
    } else if (route.template === '/pages/currentDish.html') {
      const urlObj = new URL(window.location.href);
      const id = urlObj.searchParams.get('dishId');
      import('./pages/currentDish.js').then(module => {
        module.initCurrentDishPage(id);
      });
    } else if(route.template==="/pages/cart.html"){

       import('./pages/cart.js').then(module => module.initcartPage());
    }


    // Scroll to top
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error loading page:', error);
    document.querySelector('main').innerHTML = '<div class="container"><h2>Page not found</h2><p>Sorry, the page you requested could not be found.</p></div>';
  }
};

// Navigate to a page
export const navigate = (url) => {
  window.history.pushState(null, null, url);
  loadPage(url);
};

// Set up the router
export const setupRouter = () => {
  // Create main element if it doesn't exist
  if (!document.querySelector('main')) {
    const mainElement = document.createElement('main');
    document.querySelector('#app').insertBefore(mainElement, document.querySelector('#app').lastChild);
  }

  // Handle initial page load
  loadPage(window.location.pathname);

  // Handle navigation
  document.addEventListener('click', (e) => {
    const { target } = e;

    if (target.tagName === 'A' && target.getAttribute('href').startsWith('/')) {
      e.preventDefault();
      navigate(target.getAttribute('href'));
    }
  });

  // Handle back/forward browser navigation
  window.addEventListener('popstate', () => {
    loadPage(window.location.pathname);
  });
};