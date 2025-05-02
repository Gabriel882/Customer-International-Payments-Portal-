// Name validation: only allows letters and spaces
const nameRegex = /^[a-zA-Z\s\-']+$/;
const validateName = (name) => {
  if (!name || name.length < 3) {
    return 'Name must be at least 3 characters long.';
  }
  if (!nameRegex.test(name)) {
    return 'Name must only contain letters, spaces, hyphens, or apostrophes.';
  }
  return true;
};

// ID number validation: South African 13-digit ID
const idRegex = /^\d{13}$/;
const validateID = (idNumber) => {
  if (!idNumber || idNumber.length !== 13) {
    return 'ID number must be exactly 13 digits long.';
  }
  if (!idRegex.test(idNumber)) {
    return 'ID number must only contain digits.';
  }
  return true;
};

// Account number validation: numeric values only (10 digits)
const accountNumberRegex = /^\d{10}$/;
const validateAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length !== 10) {
    return 'Account number must be exactly 10 digits long.';
  }
  if (!accountNumberRegex.test(accountNumber)) {
    return 'Account number must only contain numeric values.';
  }
  return true;
};

// Password validation
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!passwordRegex.test(password)) {
    return 'Password must contain at least one uppercase letter, one number, and one special character.';
  }
  return true;
};

module.exports = {
  validateName,
  validateID,
  validateAccountNumber,
  validatePassword,
};
