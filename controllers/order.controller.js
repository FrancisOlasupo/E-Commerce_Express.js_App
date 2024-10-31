const Order = require("../models/order.model"); // Import Order model

// #### CREATE ORDER
const createOrder = async (req, res) => {
	const { products, totalAmount } = req.body; // Get products and total amount from request body

	// Validate the products array
	if (!Array.isArray(products) || products.length === 0) {
		return res
			.status(400)
			.json({ message: "Products must be a non-empty array." });
	}

	// Validate totalAmount
	if (typeof totalAmount !== "number" || totalAmount <= 0) {
		return res
			.status(400)
			.json({ message: "Total amount must be a positive number." });
	}

	// Ensure each product has necessary fields (e.g., productId and quantity)
	for (const product of products) {
		if (!product.productId || !product.quantity || product.quantity <= 0) {
			return res.status(400).json({
				message:
					"Each product must have a valid productId and a positive quantity.",
			});
		}
	}

	// Create new order
	const newOrder = new Order({
		userId: req.user.id, // Assuming user ID is obtained from middleware
		products,
		totalAmount, // Include total amount in the order
	});

	try {
		const order = await newOrder.save(); // Save order to database
		res.status(201).json({ success: true, order }); // Success response
	} catch (error) {
		console.error(error); // Log error for server-side tracking
		res.status(500).json({
			message: "Error creating order",
			details: error.message,
		}); // Error response
	}
};

// #### GET ALL ORDERS FOR A USER
const getUserOrders = async (req, res) => {
	try {
		const orders = await Order.find({ userId: req.user.id }); // Fetch user's orders
		res.status(200).json({ success: true, orders }); // Send orders response
	} catch (error) {
		console.error(error); // Log error for server-side tracking
		res.status(500).json({
			message: "Error fetching orders",
			details: error.message,
		}); // Error response
	}
};

// Export controller functions
module.exports = {
	createOrder,
	getUserOrders,
};
