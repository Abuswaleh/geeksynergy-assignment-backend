const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => {
	try {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	} catch (err) {
		throw new Error("Failed to hash password");
	}
};

exports.isPasswordMatch = async (password, hashedPassword) => {
	return await bcrypt.compare(password, hashedPassword);
};
