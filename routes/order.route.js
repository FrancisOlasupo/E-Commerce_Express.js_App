const express = require("express"); // Import express
const router = express.Router(); // Create a new router

// Import controller functions
const {
	createOrder,
	getUserOrders,
} = require("../controllers/order.controller");

// Import auth middleware
const authMiddleware = require("../middleware/auth.middleware");

// Route for creating a new order
router.post("/", authMiddleware, createOrder); // Create a new order for the authenticated user

// Route for fetching all orders for the authenticated user
router.get("/", authMiddleware, getUserOrders); // Retrieve all orders for the user

// Optional: Route for fetching a specific order by ID (if needed in the future)
router.get("/:orderId", authMiddleware, getOrderById); // Fetch a specific order by ID

// Export routes
module.exports = router;
