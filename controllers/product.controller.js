const Product = require("../models/product.model");

// #### CREATE NEW PRODUCT (Admin only)
const createProduct = async (req, res) => {
	const userId = req.user.id; // Get the user ID from the verified token

	if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
		return res.status(403).json({
			message:
				"Access denied: You are not authorized to create products.",
		});
	}

	const { name, price, description, category } = req.body;

	if (!name || typeof name !== "string" || name.trim() === "") {
		return res
			.status(400)
			.json({ message: "Invalid input. Name is required." });
	}
	if (
		!description ||
		typeof description !== "string" ||
		description.trim() === ""
	) {
		return res
			.status(400)
			.json({ message: "Invalid input. Description is required." });
	}
	if (!category || typeof category !== "string" || category.trim() === "") {
		return res
			.status(400)
			.json({ message: "Invalid input. Category is required." });
	}
	if (typeof price !== "number" || price <= 0) {
		return res.status(400).json({
			message: "Invalid input. Price must be a positive number.",
		});
	}

	const newProduct = new Product({
		creatorId: userId,
		name,
		price,
		description,
		category,
	});

	try {
		const savedProduct = await newProduct.save();
		res.status(201).json({
			message: "Product created successfully",
			product: savedProduct,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error creating product",
			details: error.message,
		});
	}
};

// Get all products with optional query parameters
const productQuery = async (req, res) => {
	try {
		const { name, category, brand, price } = req.query;
		let query = {}; // This empty query object is Initialized to build dynamic queries

		// Then we build the query object dynamically based on the query parameters
		if (name) query.name = { $regex: name, $options: "i" };
		if (category) query.category = category;
		if (brand) query.brand = brand;
		if (price) {
			if (price.includes("-")) {
				// Uing the min max to check if price query is a range
				const [min, max] = price.split("-").map(Number); // Split the price range into min and max, then convert to numbers
				query.price = { $gte: min, $lte: max }; // Use MongoDB comparison operators for the price range ($gte = greater than or equal, $lte = less than or equal)
			} else {
				query.price = Number(price); // If it's not a range, treat it as an exact price and add it to the query object
			}
		}

		// Fetch products from the database based on the query object
		const products = await Product.find(query);
		// If matching products are found, respond with the products
		if (products.length > 0) {
			res.json({ message: "Product(s) found", data: products }); // Send a JSON response with the found products
		} else {
			res.json({
				message: "No products found matching the query parameters",
			}); // Send a response indicating no products were found
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error fetching products",
			details: error.message,
		});
	}
};

// Update a product (Admin only)
const updateProduct = async (req, res) => {
	const { name, price, description, category } = req.body;

	if (price && (typeof price !== "number" || price <= 0)) {
		return res.status(400).json({
			message: "Invalid input. Price must be a positive number.",
		});
	}

	try {
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!product) {
			return res.status(404).json({ message: "Product not found." });
		}
		res.status(200).json({ success: true, product });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error updating product",
			details: error.message,
		});
	}
};

// Delete a product (Admin only)
const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found." });
		}
		res.status(200).json({ success: true, message: "Product deleted" });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error deleting product",
			details: error.message,
		});
	}
};

// Define controller as constants
const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json({ success: true, products });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error fetching products",
			details: error.message,
		});
	}
};

// Export the controller functions
module.exports = {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	productQuery,
};
