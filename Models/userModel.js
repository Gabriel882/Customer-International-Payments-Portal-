const mongoose = require('mongoose');

// User schema definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Only allows letters (a-z, A-Z), spaces, hyphens, and apostrophes
        return /^[A-Za-z\s\-']+$/.test(v);
      },
      message: 'Name must contain only letters, spaces, hyphens, or apostrophes',
    },
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z0-9]+$/.test(v);
      },
      message: 'ID number should only contain letters and numbers',
    },
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Account number must be exactly 10 digits',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Improved regex: allows a wider range of special characters
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/.test(v);
      },
      message:
        'Password must be at least 8 characters long, with at least 1 uppercase letter, 1 number, and 1 special character',
    },
  },
});

// Pre-save middleware to check for existing ID and account number
userSchema.pre('save', async function (next) {
  const user = this;
  try {
    const existingUserById = await mongoose.models.User.findOne({ idNumber: user.idNumber });
    const existingUserByAccount = await mongoose.models.User.findOne({ accountNumber: user.accountNumber });

    if (existingUserById) {
      return next(new Error('ID number already exists.'));
    }

    if (existingUserByAccount) {
      return next(new Error('Account number already exists.'));
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Post-save error handler
userSchema.post('save', function (err, doc, next) {
  if (err.code === 11000) {
    if (err.message.includes('idNumber')) {
      err.message = 'ID number already exists.';
    } else if (err.message.includes('accountNumber')) {
      err.message = 'Account number already exists.';
    }
  }
  next(err);
});

module.exports = mongoose.model('User', userSchema);
