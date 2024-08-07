const User = require("../models/user.model");
const mongoose = require("mongoose");
const { hashPassword, isPasswordMatch } = require("../utils/hashUtils");
const { generateToken } = require("../utils/jwtUtils");
const { apiError, apiSuccess } = require("../utils/apiResponse");

exports.registerUser = async (req, res) => {
	const { name, email, password, phone, profession } = req.body;

	try {
		if (!name || !email || !password) {
			return apiError(res, 400, "Name, email and password are require");
		}
		let user = await User.findOne({ email });
		if (user) return apiError(res, 400, "User already exists");

		const hashedPassword = await hashPassword(password);
		user = await User.create({
			name,
			email,
			password: hashedPassword,
			phone,
			profession,
		});

		const token = generateToken(user);
		// excluding un-necessary fields
		const { password: _, __v, ...data } = user.toJSON();

		apiSuccess(res, 201, "User registered successfully", {
			user: data,
			token,
		});
	} catch (err) {
		console.error(err);
		apiError(res, 500, err.message || "Internal server error");
	}
};

exports.loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password)
			return apiError(res, 400, "Email and password are required");
		const user = await User.findOne({ email });
		if (!user) {
			return apiError(res, 400, "User not exist");
		}

		if (!(await isPasswordMatch(password, user.password))) {
			return apiError(res, 400, "Incorrect pssword");
		}

		const token = generateToken(user);
		// excluding un-necessary fields
		const { password: _, __v, ...data } = user.toJSON();

		apiSuccess(res, 200, "Login successful", { user: data, token });
	} catch (err) {
		console.error(err.message);
		apiError(res, 500, err.message || "Internal server error");
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select({ password: 0, __v: 0 });
		apiSuccess(res, 200, "users list fetch successfully", users);
	} catch (err) {
		console.error(err.message);
		apiError(res, 500, err.message || "Internal server error");
	}
};

exports.updateUser = async (req, res) => {
	const { name, phone, profession } = req.body;
	const { id } = req.params;

	try {
		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return apiError(res, 400, "Invalid user ID");
		}
		const user = await User.findById(id);
		if (!user) {
			return apiError(res, 404, "User not found");
		}

		user.name = name || user.name;
		user.phone = phone || user.phone;
		user.profession = profession || user.profession;

		await user.save();

		// excluding un-necessary fields
		const { password, __v, ...data } = user.toJSON();

		apiSuccess(res, 200, "User updated successfully", data);
	} catch (err) {
		console.error(err.message);
		apiError(res, 500, err.message || "Internal server error");
	}
};

exports.deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return apiError(res, 400, "Invalid user ID");
		}
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return apiError(res, 400, "User not found");
		}

		apiSuccess(res, 200, "User deleted successfully");
	} catch (err) {
		console.error(err.message);
		apiError(res, 500, err.message || "Internal server error");
	}
};
