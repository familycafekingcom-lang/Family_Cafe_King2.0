const Training = require("../models/training");
const mongoose = require("mongoose");

// Seed a default package if none exists
const seedDefaultTraining = async () => {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const count = await Training.countDocuments();
    if (count === 0) {
      await Training.create({
        heading: "Staff Training & Support",
        sub_heading: "Food Training Support (Pan India)",
        food_categories: ["Only Veg & Indian", "Fast Food", "Mocktails"],
        time_period: "6 Months Hotel Visit",
        base_cost: "₹1.5 Lakh Training Charge",
        extra_costs: ["Travel Expenses of Trainer", "Stay & Food for Trainer"],
        is_active: true,
        order: 0,
      });
      console.log("🍽️  Default Training package seeded");
    }
  } catch (err) {
    console.warn("Training seed skipped:", err.message);
  }
};
seedDefaultTraining();

// GET all training packages
exports.getAllTraining = async (req, res) => {
  try {
    const packages = await Training.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single package
exports.getTrainingById = async (req, res) => {
  try {
    const pkg = await Training.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create
exports.createTraining = async (req, res) => {
  try {
    const pkg = await Training.create(req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update
exports.updateTraining = async (req, res) => {
  try {
    const pkg = await Training.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pkg) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteTraining = async (req, res) => {
  try {
    const pkg = await Training.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
