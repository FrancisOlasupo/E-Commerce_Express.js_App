const mongoose = require("mongoose");

// Product schema
const ProductSchema = new mongoose.Schema(
	{
		productName: {
			type: String,
			required: true, // Product name is required
		},

		// Product description
		productDescription: {
			type: String,
		},

		productPrice: {
			type: Number,
			required: true, // Product price is required
		},

		productCategory: {
			type: String,
			required: true, // Product category is required
		},

		productBrand: {
			type: String,
			required: true,
		},

		stock: {
			type: Number,
			required: true,
			default: 0, // Default stock is 0
		},

		image: {
			type: String, // You can store image URLs or paths here
		},

		creatorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
			required: true, // Mark as required
		},
	},
	{ timestamps: true }
);

// Create Product model from the schema
const Product = mongoose.model("Product", ProductSchema);

// Export the Product model
module.exports = Product;
