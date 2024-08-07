const jwt = require("jsonwebtoken");

// create JWT token
exports.generateToken = (user) => {
	// no need other than id, already fetching user data at authentication
	const payload = {
		id: user._id,
		// name: user.name,
		// email: user.email,
	};
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.EXPIRES_IN,
	});
};

// Verify JWT token
exports.verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		throw new Error("Invalid token");
	}
};
