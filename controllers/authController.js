const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validateName, validateID, validateAccountNumber } = require('../utils/validator'); // Import custom validators

// Register user
exports.registerUser = async (req, res) => {
  const { name, idNumber, accountNumber, password } = req.body;

  // Step 1: Custom validation for name, idNumber, and accountNumber
  const nameValidation = validateName(name);
  if (nameValidation !== true) {
    return res.status(400).json({ message: nameValidation });
  }

  const idValidation = validateID(idNumber);
  if (idValidation !== true) {
    return res.status(400).json({ message: idValidation });
  }

  const accountValidation = validateAccountNumber(accountNumber);
  if (accountValidation !== true) {
    return res.status(400).json({ message: accountValidation });
  }

  // Step 2: Check if all required fields are provided
  if (!name || !idNumber || !accountNumber || !password) {
    return res.status(400).json({ message: 'All fields (name, idNumber, accountNumber, password) are required' });
  }

  try {
    // Step 3: Check if the user already exists by account number
    const userExists = await User.findOne({ accountNumber });
    if (userExists) {
      return res.status(400).json({ message: 'Account number already in use. Please choose a different one.' });
    }

    // Check if the user ID already exists
    const idExists = await User.findOne({ idNumber });
    if (idExists) {
      return res.status(400).json({ message: 'ID number is already registered.' });
    }

    // Step 4: Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 5: Create a new user object
    const user = new User({
      name,
      idNumber,
      accountNumber,
      password: hashedPassword,
    });

    // Step 6: Save the user to the database
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    // Step 7: Handle validation errors (e.g., Mongoose validation errors)
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: errorMessages.join(', ') });
    }

    // Handle other potential errors
    if (error.code === 11000) {
      // Duplicate key error (unique constraint violation)
      if (error.message.includes('idNumber')) {
        return res.status(400).json({ message: 'ID number already exists.' });
      }
      if (error.message.includes('accountNumber')) {
        return res.status(400).json({ message: 'Account number already exists.' });
      }
    }

    console.error(error);
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
};



// Login user
exports.loginUser = async (req, res) => {
  const { accountNumber, password } = req.body;

  // Step 1: Check if both account number and password are provided
  if (!accountNumber || !password) {
    return res.status(400).json({ message: 'Both account number and password are required.' });
  }

  try {
    // Step 2: Find the user by account number
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(400).json({ message: 'Invalid account number or password.' });
    }

    // Step 3: Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid account number or password.' });
    }

    // Step 4: Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Step 5: Send the token and success message
    res.status(200).json({ token, message: 'Login successful' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
};
