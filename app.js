const express = require("express"); // import express library from node_modules
const connectDB = require("./config/db"); // Import database connection
const dotenv = require("dotenv"); // importing dotenv from node_module
const cors = require("cors"); // Import CORS middleware
const helmet = require("helmet"); // Import helmet for security
const rateLimit = require("express-rate-limit"); // Import rate limiting
const cookieParser = require("cookie-parser"); // Import cookie parser
const { body, validationResult } = require("express-validator"); // Import express-validator
const passport = require("passport"); // // Import Passport configuration
const session = require("express-session"); // Import express-session for session management
const mongoose = require("mongoose"); // Import mongoose for database connection
const bodyParser = require("body-parser"); // Import body-parser to parse request bodies

// configuring dotenv
dotenv.config();

// Check required environment variables
if (!process.env.JWT_SECRET) {
	throw new Error("Missing JWT_SECRET in environment variables.");
}

// Connect to MongoDB
connectDB();

// Connect to MongoDB using mongoose
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("connected successfully"))
	.catch(() => console.log("error"));

// Initialize Express app
const app = express();

// #### Middleware

// Use body-parser middleware to parse JSON bodies in incoming requests
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all origins during development
app.use(helmet()); // Use helmet to set security-related HTTP headers
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Use cookie-parser to parse cookies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (if needed)
// Use express-session middleware to manage sessions
app.use(
	session({
		secret: process.env.SESSION_SECRET, // Set session secret from environment variable
		resave: false,
		saveUninitialized: true,
	})
);

// Initialize passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session()); // Use session to maintain authentication state

// Rate limiting for authentication routes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
});
app.use("/api/auth/", authLimiter); // Apply rate limiting to authentication routes

// Import routes
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.route");

// Use routes
app.use("/api/auth", authRoutes); // User authentication routes
app.use("/api/products", productRoutes); // Product management routes
app.use("/api/cart", cartRoutes); // Shopping cart routes
app.use("/api/orders", orderRoutes); // Order management routes

// Centralized error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack); // Log the error stack for debugging
	res.status(500).json({ message: "Internal server error." }); // Respond with a 500 error
});

// Start server
const PORT = process.env.PORT || 5000; // Use specified port or default to 5000

// Start the server and listen on the specified port, logging a message to confirm it's running
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`); // Log server start message
});
