const express = require("express");
const route = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

route.post("/signup", async (req, res) => {
    try {
        const { username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "User with this username already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword});
        await newUser.save();
        const role = newUser.role;
        res.status(201).json({ username, email, role});
    } catch (error) {
        res.status(500).json({ message: "Server Issue"});
        console.log("Server Error", error);
    }
});

module.exports = route;