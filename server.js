const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post(
  '/contact',
  contactLimiter,
  csrfProtection,
  [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required.'),
    body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('phone')
      .trim()
      .optional({ checkFalsy: true })
      .isMobilePhone('any')
      .withMessage('Please use a valid phone number.'),
    body('message').trim().isLength({ min: 5, max: 1000 }).withMessage('Message must be between 5 and 1000 characters.'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message } = req.body;

    // Replace this block with your email or database integration.
    console.log('Secure contact submission:', {
      name,
      email,
      phone,
      message,
    });

    return res.json({ status: 'success', message: 'Your enquiry has been received.' });
  }
);

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token.' });
  }
  return res.status(500).json({ error: 'Server error.' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
