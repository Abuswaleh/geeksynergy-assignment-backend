const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./app/config/db");
const userRoutes = require("./app/routes/user.routes");
require("dotenv").config();

const app = express();

// Connect to Database
connectDB();

// no need for cors

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // have to check
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
