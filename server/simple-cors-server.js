const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'CORS test successful!' });
});

// Login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }
  
  // Mock authentication
  if (email === 'admin@example.com' && password === 'admin123') {
    return res.json({
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }
    });
  }
  
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Simple CORS server running on port ${PORT}`);
});
