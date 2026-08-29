const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../config/verifyToken");

const route = express.Router();

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

route.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "Please provide all required fileds."});
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: "Email not found."});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status (401).json({message: "Invalid password."});
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({message: "Server Issue"});
        console.log("Server Error: ", error)};
});

route.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.status(200).json(user);
    } catch(error) {
        res.status(500).json(error);
    }
})
module.exports = route;