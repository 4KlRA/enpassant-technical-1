const dns = require("dns");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

require("dotenv").config();
const connectDB = require("./src/config/db.js")

const express = require("express");

const app = express();

const PORT = 5000;

app.use(express.json());

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

app.get("/", (req, res) => {
    res.send("EnPasaant API is running.")
})