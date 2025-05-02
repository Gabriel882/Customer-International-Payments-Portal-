const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // ✅ New import
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

dotenv.config(); // Load .env

const app = express();

// === CORS Configuration ===
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourfrontenddomain.com'
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// === Swagger Configuration ===
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Customer International Payments Portal API',
      description: 'API documentation for the Customer International Payments Portal',
      version: '1.0.0',
      contact: {
        name: 'Your Name',
        email: 'your-email@example.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://yourbackend.com/api'
          : 'http://localhost:5000/api',
        description: process.env.NODE_ENV === 'production'
          ? 'Production Server'
          : 'Local Development Server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// === Rate Limiter ===
const limiter = rateLimit({
  windowMs: 25 * 60 * 1000, // 25 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});

// === Middleware ===
app.use(limiter);
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // ✅ Added user route

// === Swagger ===
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// === MongoDB Connection ===
if (!process.env.MONGO_URI) {
  console.error("MongoDB URI not provided");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  setTimeout(() => {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }, 5000);
});

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

module.exports = app;
