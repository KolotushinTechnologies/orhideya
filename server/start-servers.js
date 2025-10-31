const { spawn } = require('child_process');
const path = require('path');

// Start the API server
console.log('Starting API server...');
const apiServer = spawn('node', ['src/index.js'], {
  cwd: path.resolve(__dirname),
  stdio: 'inherit'
});

// Start the CORS proxy
console.log('Starting CORS proxy...');
const corsProxy = spawn('node', ['cors-proxy.js'], {
  cwd: path.resolve(__dirname),
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping servers...');
  apiServer.kill();
  corsProxy.kill();
  process.exit();
});

console.log('Both servers are running. Press Ctrl+C to stop.');
