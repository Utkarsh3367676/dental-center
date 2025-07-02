// Authentication service using localStorage
const AUTH_KEY = 'dental_auth';
const USERS_KEY = 'dental_users';

// Initialize default users if none exist
const initializeUsers = () => {
  // Always ensure we have the default users for testing
  const defaultUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Dr. John Smith' },
    { id: 2, username: 'patient1', password: 'patient123', role: 'patient', name: 'Jane Doe' },
    { id: 3, username: 'patient2', password: 'patient123', role: 'patient', name: 'John Doe' },
    { id: 4, username: 'patient3', password: 'patient123', role: 'patient', name: 'Robert Johnson' },
    { id: 5, username: 'patient4', password: 'patient123', role: 'patient', name: 'Emily Davis' },
    { id: 6, username: 'patient5', password: 'patient123', role: 'patient', name: 'Michael Wilson' }
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  console.log('Initialized users:', defaultUsers);
};

// Initialize data
export const initializeAuth = () => {
  initializeUsers();
};

// Login function
export const login = (username, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const authData = {
      isAuthenticated: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return authData;
  }
  
  return { isAuthenticated: false, user: null };
};

// Logout function
export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  return { isAuthenticated: false, user: null };
};

// Get current auth state
export const getAuthState = () => {
  const authData = localStorage.getItem(AUTH_KEY);
  return authData ? JSON.parse(authData) : { isAuthenticated: false, user: null };
};

// Register new user
export const register = (userData) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    ...userData
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return newUser;
};
