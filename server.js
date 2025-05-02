const http = require('http'); // Use HTTP for now, bypass SSL 
const app = require('./app'); // Your Express app
const dotenv = require('dotenv');
dotenv.config();

// Create an HTTP server instead of HTTPS to bypass SSL
// **NOTE: SSL is bypassed here for development purposes. In production, you should use HTTPS for security.**
http.createServer(app).listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
