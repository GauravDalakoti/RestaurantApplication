const API_URL = import.meta.env.VITE_API_URL;

// Check if user is authenticated
export const checkUserAuth = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.token) {
    // Validate token (optional, but recommended)
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        // Token invalid, log user out
        logout();
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
    
    // Update navigation based on auth status
    updateNavForAuth(user.isAdmin);
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Save user info in local storage
    localStorage.setItem('user', JSON.stringify(data));
    
    // Update navigation
    updateNavForAuth(data.isAdmin);
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Register user
export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Save user info in local storage
    localStorage.setItem('user', JSON.stringify(data));
    
    // Update navigation
    updateNavForAuth(data.isAdmin);
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
  updateNavForAuth(false);
  
  // Redirect to home if on admin page
  if (window.location.pathname.startsWith('/admin')) {
    window.location.href = '/';
  }
};

// Update navigation based on auth status
export const updateNavForAuth = (isAdmin) => {
  const authNav = document.querySelector('.auth-nav');
  
  if (!authNav) return;
  
  if (localStorage.getItem('user')) {
    // User is logged in
    authNav.innerHTML = `
      ${isAdmin ? '<a href="/admin">Admin Dashboard</a>' : ''}
      <a href="#" id="logout-link">Logout</a>
    `;
    
    // Add event listener to logout link
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    // User is not logged in
    authNav.innerHTML = `
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    `;
  }
};

// Get auth token
export const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

// Check if user is admin
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.isAdmin : false;
};