const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authentication");
const userController = require("../controllers/user.controller");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/userslist", authenticate, userController.getAllUsers);
router.put("/update/:id", authenticate, userController.updateUser);
router.delete("/delete/:id", authenticate, userController.deleteUser);

module.exports = router;
