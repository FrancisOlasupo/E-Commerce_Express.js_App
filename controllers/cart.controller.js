const Cart = require("../models/cart.model"); // Import the Cart model
const Product = require("../models/product.model"); // Import the Product model
const mongoose = require("mongoose"); // Import mongoose for ObjectId validation
const { body, validationResult } = require("express-validator"); // Import validation library
const { authMiddleware } = require("../middleware/auth.middleware");
const {
	validateRegister,
	validateLogin,
	validateAddToCart,
} = require("../middleware/auth.middleware");

// #### ADDING A PRODUCT TO THE USER'S CART
const addProductToCart = async (req, res) => {
	// Validate request body
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const { productId, quantity } = req.body; // Extract product ID and quantity
		const userId = req.user.id; // Get user ID from authenticated user

		// Check if product is still in stock (product availability)
		const product = await Product.findById(productId); // Find the product by ID
		if (!product) {
			return res.status(404).json({ message: "Product not found." });
		}
		if (product.stock < quantity) {
			return res
				.status(400)
				.json({ message: "Not enough stock available." });
		}

		// Then find user's cart
		let cart = await Cart.findOne({ userId });
		if (!cart) {
			// If cart doesn't exist, create a new one
			cart = new Cart({ userId, items: [], totalPrice: 0 });
		}

		// Check if the product is already in the cart
		const existingItemIndex = cart.items.findIndex(
			(item) => item.productId.toString() === productId
		);
		if (existingItemIndex !== -1) {
			// condition 1: if it exista, Update existing item
			cart.items[existingItemIndex].quantity += quantity;
			cart.items[existingItemIndex].price =
				cart.items[existingItemIndex].quantity * product.price;
		} else {
			// condition 2: if not, Add new item to cart
			cart.items.push({
				productId: product._id,
				quantity,
				price: quantity * product.price,
			});
		}

		// Update the user cart's total price
		cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

		const updatedCart = await cart.save(); // Save to the cart

		res.status(200).json({
			message: "Product added to cart",
			cart: updatedCart,
		});
	} catch (error) {
		logger.error("Error adding product to cart:", error); // Log the error
		res.status(500).json({
			message: "Error adding product to cart",
			details: error.message,
		});
	}
};

// #### ROMOVING A PRODUCT FROM THE USER'S CART
const removeProductFromCart = async (req, res) => {
	// Validate request body
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const userId = req.user.id; // Get user ID from authenticated user
	const { productId } = req.body; // Extract product ID

	try {
		const cart = await Cart.findOne({ userId }); // Find the user's cart
		if (!cart) {
			return res.status(404).json({ message: "Cart not found." });
		}

		// Check if the product is in the cart
		const itemIndex = cart.items.findIndex(
			(item) => item.productId.toString() === productId
		);
		if (itemIndex === -1) {
			return res
				.status(404)
				.json({ message: "Product not found in cart." });
		}

		// Remove the product from the cart
		cart.items.splice(itemIndex, 1);
		cart.totalPrice = cart.items.reduce(
			(total, item) => total + item.price,
			0
		); // Update total price
		await cart.save(); // Save changes

		res.status(200).json({ message: "Product removed from cart", cart });
	} catch (error) {
		logger.error("Failed to remove product from cart:", error); // Log the error
		res.status(500).json({
			error: "Failed to remove product from cart",
			details: error.message,
		});
	}
};

// #### VIEWING USER'S CART
const viewCart = async (req, res) => {
	const userId = req.user.id; // Get user ID from authenticated user

	try {
		const cart = await Cart.findOne({ userId }).populate(
			"items.productId",
			"name price" // Populate product details
		);
		if (!cart) {
			return res.status(404).json({ message: "Cart is empty." });
		}

		res.status(200).json({ cart });
	} catch (error) {
		logger.error("Failed to retrieve cart:", error); // Log the error
		res.status(500).json({
			error: "Failed to retrieve cart",
			details: error.message,
		});
	}
};

// #### TO DECREASE THE QUANTITY OF ITEMS IN THE CART
const decreaseProductQuantity = async (req, res) => {
	const userId = req.user.id; // Get user ID from authenticated user
	const { productId } = req.body; // Extract product ID

	try {
		const cart = await Cart.findOne({ userId }); // Find the user's cart
		if (!cart) {
			return res.status(404).json({ message: "Cart not found." });
		}

		// Check if the product is in the cart
		const itemIndex = cart.items.findIndex(
			(item) => item.productId.toString() === productId
		);
		if (itemIndex === -1) {
			return res
				.status(404)
				.json({ message: "Product not found in cart." });
		}

		const item = cart.items[itemIndex]; // Get the item
		if (item.quantity > 1) {
			// If quantity is more than 1, decrease it
			item.quantity -= 1;
			const product = await Product.findById(productId); // Find product details
			item.price = item.quantity * product.price; // Update price
		} else {
			// If quantity is 1, remove the item
			cart.items.splice(itemIndex, 1);
		}

		// Update total price of the cart
		cart.totalPrice = cart.items.reduce(
			(total, item) => total + item.price,
			0
		);
		await cart.save(); // Save changes
		res.status(200).json({ message: "Product quantity updated", cart });
	} catch (error) {
		logger.error("Failed to update product quantity:", error); // Log the error
		res.status(500).json({
			error: "Failed to update product quantity",
			details: error.message,
		});
	}
};

// #### TO CLEAR ALL ITEM IN THE CART
const clearCart = async (req, res) => {
	const userId = req.user.id; // Get user ID from authenticated user

	try {
		const cart = await Cart.findOne({ userId }); // Find the user's cart
		if (!cart) {
			return res.status(404).json({ message: "Cart not found." });
		}

		// Clear the cart
		cart.items = [];
		cart.totalPrice = 0; // Reset total price
		await cart.save(); // Save changes
		res.status(200).json({ message: "Cart cleared", cart });
	} catch (error) {
		logger.error("Failed to clear cart:", error); // Log the error
		res.status(500).json({
			error: "Failed to clear cart",
			details: error.message,
		});
	}
};

module.exports = {
	addProductToCart,
	viewCart,
	removeProductFromCart,
	decreaseProductQuantity,
	clearCart,
};
