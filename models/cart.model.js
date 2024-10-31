const mongoose = require("mongoose");

// Cart schema
const CartSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to User model
			required: true,
		},

		items: [
			{
				// Array of products in the cart
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},

				quantity: {
					type: Number,
					required: true,
					min: 1, // this field ensures the quantity is at least 1
					default: 1,
				},

				price: {
					type: Number,
					required: true,
				},
			},
		],

		totalPrice: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ timestamps: true }
);

// Create Cart model from the schema
const Cart = mongoose.model("Cart", CartSchema);

// Export the Cart model
module.exports = Cart;
