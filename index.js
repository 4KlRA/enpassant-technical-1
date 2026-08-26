const dns = require("dns");
const express = require("express");
const app = express();
app.use(express.json());
const connectDB = require("./src/config/db.js")
const authRoutes = require("./src/routes/authRoutes.js");
app.use("/", authRoutes);

dns.setServers(["1.1.1.1", "1.0.0.1"]);

require("dotenv").config();

const PORT = 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

app.get("/", (req, res) => {
    res.send("EnPasaant API is running.")
})