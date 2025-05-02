const express = require('express');
const { body, validationResult } = require('express-validator'); // Import express-validator
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               idNumber:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - idNumber
 *               - accountNumber
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', [
  // Validation checks
  body('name')
  .trim()
  .isLength({ min: 3 })
  .withMessage('Name must be at least 3 characters long')
  .matches(/^[A-Za-z\s\-']+$/)
  .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),


  body('idNumber')
    .isLength({ min: 13, max: 13 })
    .withMessage('ID number must be exactly 13 digits')
    .matches(/^\d{13}$/)
    .withMessage('ID number must only contain numbers'),

  body('accountNumber')
    .isLength({ min: 10, max: 10 })
    .withMessage('Account number must be exactly 10 digits')
    .matches(/^\d{10}$/)
    .withMessage('Account number must only contain digits'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)
    .withMessage('Password must contain at least one uppercase letter, one number, and one special character')
], (req, res, next) => {
  // Check if validation failed
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If validation passes, proceed to the controller logic
  next();
}, authController.registerUser);  // Call the controller method for registering the user

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with their account number and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - accountNumber
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid account number or password
 */
router.post('/login', [
  // Validation checks
  body('accountNumber')
    .isLength({ min: 10, max: 10 })
    .withMessage('Account number must be exactly 10 digits')
    .matches(/^\d{10}$/)
    .withMessage('Account number must only contain digits'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], (req, res, next) => {
  // Check if validation failed
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If validation passes, proceed to the controller logic
  next();
}, authController.loginUser);  // Call the controller method for logging in the user

module.exports = router;
