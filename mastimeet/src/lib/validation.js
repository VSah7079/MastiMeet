// Frontend validation utilities matching backend rules

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

export const validatePassword = (password) => {
  if (password.length < 6) return { isValid: false, message: 'At least 6 characters' };
  if (!/[A-Z]/.test(password)) return { isValid: false, message: 'At least 1 uppercase letter' };
  if (!/[0-9]/.test(password)) return { isValid: false, message: 'At least 1 number' };
  return { isValid: true, message: 'Strong password' };
};

export const validateUsername = (username) => {
  if (username.length < 3 || username.length > 20) {
    return { isValid: false, message: '3-20 characters required' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, message: 'Only letters, numbers, underscores allowed' };
  }
  return { isValid: true, message: '' };
};

export const validateAge = (age) => {
  const ageNum = Number(age);
  if (isNaN(ageNum) || ageNum < 18 || ageNum > 120 || !Number.isInteger(ageNum)) {
    return { isValid: false, message: 'Must be between 18 and 120' };
  }
  return { isValid: true, message: '' };
};

export const validateGender = (gender) => {
  const validGenders = ['male', 'female', 'other', 'prefer-not-to-say'];
  if (!validGenders.includes(gender?.toLowerCase())) {
    return { isValid: false, message: 'Invalid gender selection' };
  }
  return { isValid: true, message: '' };
};

// Validate registration form
export const validateRegistrationForm = (formData) => {
  const errors = {};

  // Username
  if (!formData.username) {
    errors.username = 'Username is required';
  } else {
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.message;
    }
  }

  // Email
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email';
  }

  // Password
  if (!formData.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = `Password: ${passwordValidation.message}`;
    }
  }

  // Confirm Password
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Age
  if (formData.age) {
    const ageValidation = validateAge(formData.age);
    if (!ageValidation.isValid) {
      errors.age = ageValidation.message;
    }
  } else {
    errors.age = 'Age is required';
  }

  // Gender
  if (!formData.gender) {
    errors.gender = 'Please select a gender';
  } else {
    const genderValidation = validateGender(formData.gender);
    if (!genderValidation.isValid) {
      errors.gender = genderValidation.message;
    }
  }

  // Terms
  if (!formData.agreeTerms) {
    errors.agreeTerms = 'You must agree to the terms and conditions';
  }

  return errors;
};

// Validate login form
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

// Get password strength
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };
  
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500'];
  
  return { strength, label: levels[strength], color: colors[strength] };
};

// Format validation error messages
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An error occurred. Please try again.';
};
