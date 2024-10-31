const { body, validationResult } = require("express-validator");

// Validation for user registration
const validateRegister = [
	body("username").notEmpty().withMessage("Username is required."),
	body("email")
		.isEmail()
		.withMessage("Invalid email format.")
		.normalizeEmail(), // Normalize the email (remove spaces, convert to lowercase)
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long."),
	body("name").notEmpty().withMessage("Name is required."),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

// Validation for user login
const validateLogin = [
	body("email").isEmail().withMessage("Invalid email format."),
	body("password").notEmpty().withMessage("Password is required."),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

// Middleware for validating request body for removing an item
const validateRemoveFromCart = [
	body("productId").isMongoId().withMessage("Invalid Product ID."),
];

// Middleware for validating request body for adding items to cart
const validateAddToCart = [
	body("productId").isMongoId().withMessage("Invalid Product ID."),
	body("quantity")
		.isInt({ gt: 0 })
		.withMessage("Quantity must be a positive integer."),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

module.exports = {
	validateRegister,
	validateLogin,
	validateAddToCart,
};
