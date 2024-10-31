const User = require("../models/user.model"); // Import user schema from model (MongoDB)
const bcrypt = require("bcryptjs"); // Import bcrypt library for hashing passwords
const jwt = require("jsonwebtoken"); // Import JWT library for creating JSON Web Tokens

// #### Register a new user
const registerUser = async (req, res) => {
	const { username, email, password, role, ...others } = req.body;

	try {
		// Check for existing user by email
		const existingUserEmail = await User.findOne({ email });
		if (existingUserEmail) {
			return res
				.status(400)
				.json({ message: "Email already in use, please login." });
		}

		// Check for existing user by username
		const existingUsernameUser = await User.findOne({ username });
		if (existingUsernameUser) {
			return res
				.status(400)
				.json({ message: "Username already in use." });
		}

		// Hashing the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user object
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			role, // Include role for user management
			...others,
		});

		// Save the new user to the database
		const savedUser = await newUser.save();

		// Respond with success message and user data (excluding sensitive info)
		res.status(201).json({
			message: "Account successfully created.",
			user: {
				id: savedUser._id,
				username: savedUser.username,
				email: savedUser.email,
				gender: savedUser.gender,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: "Server timeout",
			message: error.message,
		});
	}
};

// #### User login
const userLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Finding the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Checking if the user password matches
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials." });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		// Send the token as an HTTP-only cookie
		res.cookie("user_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Use secure cookie in production
			sameSite: "Strict", // Helps prevent CSRF attacks
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});

		res.status(200).json({
			message: "Login successful",
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: "Server error while logging in." });
	}
};

// #### User logout
const userLogout = (req, res) => {
	try {
		// Clear the cookie from client side to logout the user
		res.clearCookie("user_token");
		return res
			.status(200)
			.json({ message: "User successfully logged out." });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Error occure, please try again later." });
	}
};

// Export all functions for use in routes
module.exports = {
	registerUser,
	userLogin,
	userLogout,
};
