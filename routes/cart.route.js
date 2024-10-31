const express = require("express"); // Import express
const router = express.Router(); // Create a new router

const {
	addToCart,
	removeFromCart,
	viewCart,
	decreaseProductQuantity,
	clearCart,
} = require("../controllers/cart.controller");

const authMiddleware = require("../middleware/auth.middleware");

const {
	validateRegister,
	validateLogin,
} = require("../middleware/validation.middleware");

// Protect the cart routes with authentication middleware
router.post("/", authMiddleware, addToCart); // Add to cart
router.delete("/:productId", authMiddleware, removeFromCart); // Remove from cart
router.get("/", authMiddleware, viewCart); // View cart
router.patch("/decrease", authMiddleware, decreaseProductQuantity); // Decrease quantity
router.delete("/clear", authMiddleware, clearCart); // Clear cart

module.exports = router;
