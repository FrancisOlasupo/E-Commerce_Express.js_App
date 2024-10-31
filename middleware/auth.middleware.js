const jwt = require("jsonwebtoken"); // Import JWT library
const User = require("../models/user.model"); // Import User model

// Middleware to authenticate user and check for admin role
const authMiddleware = async (req, res, next) => {
	const token = req.header("Authorization"); // Get token from request header

	// Check if token is provided
	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." }); // Unauthorized response
	}

	// Check if token is prefixed with "Bearer "
	const tokenParts = token.split(" ");
	if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
		return res
			.status(401)
			.json({ message: "Access denied. Invalid token format." }); // Unauthorized response
	}

	try {
		const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET); // Verify token
		const user = await User.findById(decoded.id); // Attach user to request

		// Check if user exists
		if (!user) {
			return res
				.status(401)
				.json({ message: "Access denied. User not found." }); // Unauthorized response
		}

		req.user = user; // Attach user to request
		next(); // Proceed to the next middleware/route handler
	} catch (error) {
		console.error(error); // Log the error for debugging
		res.status(401).json({ message: "Access denied. Invalid token." }); // Unauthorized response
	}
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
	if (!req.user || !req.user.isAdmin) {
		return res.status(403).json({ message: "Access denied. Admins only." });
	}
	next(); // Proceed to the next middleware/route handler
};

module.exports = authMiddleware; // Export the middleware
