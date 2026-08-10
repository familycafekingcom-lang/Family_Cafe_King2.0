const Launch = require("../models/launch");

// Get all upcoming launches
exports.getAllLaunches = async (req, res) => {
  try {
    const launches = await Launch.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: launches.length,
      data: launches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create launch (Admin protected)
exports.createLaunch = async (req, res) => {
  try {
    const { city, brand, date_text, image_data, tag, accent } = req.body;
    if (!city || !brand || !date_text) {
      return res.status(400).json({
        success: false,
        message: "City, brand, and date text are required",
      });
    }

    const launch = await Launch.create({
      city,
      brand,
      date_text,
      image_data,
      tag: tag || "Coming Soon",
      accent: accent || "#8C1F28",
    });

    res.status(201).json({
      success: true,
      message: "Upcoming Launch created successfully",
      data: launch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update launch (Admin protected)
exports.updateLaunch = async (req, res) => {
  try {
    const launch = await Launch.findById(req.params.id);
    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch item not found",
      });
    }

    const { city, brand, date_text, image_data, tag, accent } = req.body;
    if (city !== undefined) launch.city = city;
    if (brand !== undefined) launch.brand = brand;
    if (date_text !== undefined) launch.date_text = date_text;
    if (image_data !== undefined) launch.image_data = image_data;
    if (tag !== undefined) launch.tag = tag;
    if (accent !== undefined) launch.accent = accent;

    await launch.save();

    res.json({
      success: true,
      message: "Upcoming Launch updated successfully",
      data: launch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete launch (Admin protected)
exports.deleteLaunch = async (req, res) => {
  try {
    const launch = await Launch.findById(req.params.id);
    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch item not found",
      });
    }

    await launch.deleteOne();

    res.json({
      success: true,
      message: "Upcoming Launch removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

