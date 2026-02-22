// Input validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 number
  if (password.length < 6) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

const validateUsername = (username) => {
  // 3-20 chars, alphanumeric + underscore
  if (username.length < 3 || username.length > 20) return false;
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false;
  return true;
};

const validateAge = (age) => {
  const ageNum = Number(age);
  return ageNum >= 18 && ageNum <= 120 && Number.isInteger(ageNum);
};

const validateGender = (gender) => {
  return ['male', 'female', 'other', 'prefer-not-to-say'].includes(gender?.toLowerCase());
};

// Sanitize input (prevent XSS)
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 500); // Limit length
};

// Validation middleware
export const validateRegistration = (req, res, next) => {
  try {
    const { username, email, password, age, gender } = req.body;

    // Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.',
        errors: {
          username: !username ? 'Required' : null,
          email: !email ? 'Required' : null,
          password: !password ? 'Required' : null
        }
      });
    }

    const errors = {};

    // Validate username
    if (!validateUsername(username)) {
      errors.username = 'Username must be 3-20 characters, alphanumeric with underscores only';
    }

    // Validate email
    if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!validatePassword(password)) {
      errors.password = 'Password must be at least 6 characters with 1 uppercase letter and 1 number';
    }

    // Validate age
    if (age && !validateAge(age)) {
      errors.age = 'You must be between 18 and 120 years old';
    }

    // Validate gender
    if (gender && !validateGender(gender)) {
      errors.gender = 'Please select a valid gender option';
    }

    // If there are errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Sanitize inputs
    req.body.username = sanitizeInput(username);
    req.body.email = sanitizeInput(email).toLowerCase();
    if (gender) req.body.gender = sanitizeInput(gender).toLowerCase();

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Validation error' });
  }
};

export const validateLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        errors: {
          email: !email ? 'Required' : null,
          password: !password ? 'Required' : null
        }
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        errors: { email: 'Invalid email address' }
      });
    }

    // Sanitize inputs
    req.body.email = sanitizeInput(email).toLowerCase();
    req.body.password = sanitizeInput(password);

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Validation error' });
  }
};

export const validateVerifyEmail = (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== 'string' || token.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token',
        errors: { token: 'Valid token is required' }
      });
    }

    req.body.token = sanitizeInput(token);
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Validation error' });
  }
};

export { sanitizeInput };
