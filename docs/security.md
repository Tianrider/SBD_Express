# Security Measures

## SQL Injection Protection

This application implements multiple layers of protection against SQL injection attacks:

### 1. SQL Injection Middleware

The `sqlInjectionFilter` middleware in `middlewares/sql-injection.middleware.js` provides application-level protection by:

-   Checking all incoming requests (body, query parameters, and URL parameters) for common SQL injection patterns
-   Blocking requests that contain suspicious SQL patterns
-   Sanitizing input by escaping HTML entities and removing potentially harmful patterns

### 2. Parameterized Queries

All database queries use parameterized queries (prepared statements) which effectively prevent SQL injection by separating SQL code from user data:

```javascript
// Example of parameterized query
const {rows} = await db.query("SELECT * FROM users WHERE email = $1", [email]);
```

### 3. Input Sanitization

The `inputSanitizer.js` utility provides functions to sanitize user input and prevent not only SQL injection but also XSS attacks:

-   `sanitizeString`: Escapes HTML entities and removes dangerous patterns from strings
-   `sanitizeObject`: Recursively sanitizes all string values in an object

## Other Security Measures

### Rate Limiting

The application uses rate limiting to prevent brute force attacks and DoS attacks:

```javascript
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per window
	message: "Too many requests, please try again later.",
});
```

### Authentication

JWT-based authentication is implemented to secure API endpoints:

-   Tokens are verified for all protected routes
-   Token expiration limits the window of opportunity for attacks

### CORS Protection

The application has CORS policies to restrict which origins can access the API:

```javascript
const corsOptions = {
	origin: "https://os.netlabdte.com",
	methods: ["GET", "POST", "PUT", "DELETE"],
};
```

## Best Practices for Developers

When adding new features or endpoints to this application:

1. Always use parameterized queries for database operations
2. Apply the authentication middleware to protect sensitive endpoints
3. Validate and sanitize all user inputs
4. Be cautious with dynamic SQL statements
5. Follow the principle of least privilege for database access
