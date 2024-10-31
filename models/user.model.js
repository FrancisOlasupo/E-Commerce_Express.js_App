const mongoose = require("mongoose"); // Import mongoose from node_module

// creating a schema (structure) for the user details
const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true, //this ensures that this field is important and would throw an error if info is not provided
			unique: true, // Ensure unique usernames
		},
		email: {
			type: String,
			required: true, //this ensures that this field is important and would throw an error if info is not provided
			unique: true, //this ensures that no two emails can be registered on our express application
		},
		password: {
			type: String,
			required: true, // Hashed password
		},

		role: {
			type: String,
			enum: ["user", "Admin", "SuperAdmin"], // Define the possible roles
			default: "user",
		},
	},
	{ timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Create User model from the schema
const User = mongoose.model("User", UserSchema);

// Export the User model
module.exports = User;
