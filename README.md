# SBT Academy Landing Page

This workspace includes a static landing page and a secure backend example for the contact form.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open:

```bash
http://localhost:3000
```

## Security features in the backend

- `helmet` for secure HTTP headers
- `cookie-parser` + `csurf` for CSRF protection
- `express-rate-limit` to throttle contact submissions
- `express-validator` for input validation and sanitization
- `secure` cookie settings when `NODE_ENV=production`

## Notes

This backend currently logs validated contact requests to the console. Replace the placeholder handler with your email service or database layer.
