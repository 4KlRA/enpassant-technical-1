const express = require("express");
const verifyToken = require("../config/verifyToken");
const Resource = require("../models/Resource");
const isAdmin = require("../config/isAdmin");

const route = express.Router();

route.get("/", verifyToken, async (req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({message: "Server error", error: error});
    }
});

route.get("/:id", verifyToken, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if(!resource) {
            return res.status(404).json({message: "Resource not found"});
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({message: "Server error", error: error});
    }
});

route.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const {title, description} = req.body;
        const resource = await Resource.create({title, description});
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({message: "Server error", error: error});
    }
});

route.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {    
        const resource = await Resource.findById(req.params.id);
        if(!resource) {
            return res.status(404).json({message: "Resource not found"});
        }
        if(req.body.title) resource.title = req.body.title;
        if(req.body.description) resource.description = req.body.description;
        await resource.save();
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({message: "Server error", error: error});
    }
});

route.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if(!resource) {
            return res.status(404).json({message: "Resource not found"});
        }
        await resource.deleteOne();
        res.status(200).json({message: "Resource deleted"});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error});
    }
});

module.exports = route;