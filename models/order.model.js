const mongoose = require("mongoose");

// Define possible order statuses
const orderStatuses = [
	"Pending",
	"Processing",
	"Shipped",
	"Delivered",
	"Cancelled",
	"Returned",
];

// Order schema
const OrderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to User model
			required: true,
		},

		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true, // Ensure productId is required
				},
				quantity: {
					type: Number,
					required: true,
					min: 1, // Ensure quantity is at least 1
					default: 1, // Default quantity is 1
				},
				price: {
					type: Number,
					required: true, // Ensure price is required
				},
				image: {
					type: String,
					required: true, // Ensure image URL is required
				},
				name: {
					type: String,
					required: true, // Ensure product name is provided
				},
			},
		],

		totalAmount: {
			type: Number,
			required: true,
			default: 0, // Default total amount is 0
		},

		discount: {
			type: Number,
			default: 0, // Default discount is 0
		},

		finalAmount: {
			type: Number,
			required: true,
			default: 0, // Final amount after discounts
		},

		status: {
			type: String,
			enum: orderStatuses, // Use enum for status
			default: "Pending", // Default order status
		},

		address: {
			type: String,
			required: true, // Address is required for shipping
		},

		paymentMethod: {
			type: String,
			enum: ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery"], // Example payment methods
			required: true, // Payment method is required
		},

		shippingDate: {
			type: Date, // Optional field for shipping date
		},

		deliveredDate: {
			type: Date, // Optional field for delivery date
		},
	},
	{ timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create Order model from the schema
const Order = mongoose.model("Order", OrderSchema);

// Export the Order model
module.exports = Order;
