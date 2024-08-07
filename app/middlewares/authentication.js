const User = require("../models/user.model");
const { apiError } = require("../utils/apiResponse");
const { verifyToken } = require("../utils/jwtUtils");

exports.authenticate = (req, res, next) => {
	let token = req.header("Authorization");

	token = token?.split(" ")[1];

	if (!token) {
		return apiError(res, 401, "No token provided, authorization denied");
	}

	try {
		const decoded = verifyToken(token);

		// additional check if user exist for valid token,
		const user = User.findById(decoded.id);

		if (!user) {
			return apiError(res, 400, "User not exist");
		}

		req.user = user;
		next();
	} catch (err) {
		apiError(res, 401, "Token is not valid");
	}
};
