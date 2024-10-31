const express = require("express"); // Import express
const router = express.Router(); // Create a new router
const {
	registerUser,
	userLogin,
	userLogout,
} = require("../controllers/user.controller"); // Import user controller

// Import validation middlewares
const {
	validateRegister,
	validateLogin,
} = require("../middleware/validation.middleware");

// Import authentication middleware
const authMiddleware = require("../middleware/auth.middleware");

// Route for user registration with validation
router.post("/register", validateRegister, registerUser);

// Route for user login with validation
router.post("/login", validateLogin, userLogin);

// Route for logging out
router.post("/logout", authMiddleware, userLogout);

// Protected route that requires authentication
router.get("/profile", authMiddleware, (req, res) => {
	res.status(200).json({ message: "Profile data", user: req.user });
});

// Export routes
module.exports = router;
