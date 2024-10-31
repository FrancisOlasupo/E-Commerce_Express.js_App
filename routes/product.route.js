const express = require("express"); // Import express
const router = express.Router(); // Create a new router

// Import controllers
const {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	productQuery,
} = require("../controllers/product.controller");

// Middleware for product queries
const authMiddleware = require("../middleware/auth.middleware"); // Import auth middleware

// Import validation middleware
const { validateProduct } = require("../middleware/validation.middleware");

// Route for fetching all products
router.get("/", getAllProducts); // Retrieve all available products

// Route for creating a new product (Admin only)
router.post("/", authMiddleware, validateProduct, createProduct); // Create a new product with validation

// Route for updating a product (Admin only)
router.put("/:id", authMiddleware, validateProduct, updateProduct); // Update an existing product with validation

// Route for deleting a product (Admin only)
router.delete("/:id", authMiddleware, deleteProduct); // Delete a product by ID (Admin only)

// Export routes
module.exports = router;
