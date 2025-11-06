const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express app
const app = express();

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true
}));

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Create proxy middleware
const apiProxy = createProxyMiddleware({
  target: 'https://api.orhideyanhk.ru',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    // Add CORS headers to the proxy request
    proxyReq.setHeader('Origin', 'https://api.orhideyanhk.ru');
    
    // Log the request body for debugging
    if (req.body) {
      console.log('Request Body:', req.body);
      
      // If the body is already parsed, we need to rewrite the body
      if (req.body && !proxyReq.headersSent) {
        const bodyData = JSON.stringify(req.body);
        // Update content-length
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        // Write body to request
        proxyReq.write(bodyData);
      }
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to the proxy response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin';
    
    // Log the response for debugging
    console.log(`Response Status: ${proxyRes.statusCode}`);
  }
});

// Proxy all requests to the API server
app.use('/', apiProxy);

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy server running on port ${PORT}`);
  console.log(`Proxying requests to https://api.orhideyanhk.ru`);
});
