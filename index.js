require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db.js")
const authRoutes = require("./src/routes/authRoutes.js");
const resourceRoutes = require("./src/routes/resourceRoutes.js");

const app = express();
app.use(express.json());

connectDB();

app.use("/", authRoutes);
app.use("/resources", resourceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});