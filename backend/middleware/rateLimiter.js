// Rate limiting middleware
const rateLimitStore = new Map();

const RATE_LIMIT_CONFIG = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  register: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  verifyEmail: { maxAttempts: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10 attempts per 24 hours
  default: { maxAttempts: 100, windowMs: 60 * 60 * 1000 } // 100 per hour
};

const createRateLimiter = (endpoint) => {
  const config = RATE_LIMIT_CONFIG[endpoint] || RATE_LIMIT_CONFIG.default;

  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `${endpoint}:${identifier}`;
    const now = Date.now();

    // Clean up old entries
    if (rateLimitStore.has(key)) {
      const data = rateLimitStore.get(key);
      data.attempts = data.attempts.filter((time) => now - time < config.windowMs);

      if (data.attempts.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, data);
      }
    }

    // Check if limit exceeded
    const data = rateLimitStore.get(key);
    if (data && data.attempts.length >= config.maxAttempts) {
      const oldestAttempt = data.attempts[0];
      const resetTime = new Date(oldestAttempt + config.windowMs);
      return res.status(429).json({
        success: false,
        message: `Too many ${endpoint} attempts. Try again after ${resetTime.toLocaleTimeString()}`,
        retryAfter: Math.ceil((resetTime - now) / 1000)
      });
    }

    // Record this attempt
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { attempts: [] });
    }
    rateLimitStore.get(key).attempts.push(now);

    next();
  };
};

export default createRateLimiter;
