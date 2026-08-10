const Slider = require("../models/slider");

// Get all slides (public, active first or all for admin)
exports.getAllSlides = async (req, res) => {
  try {
    const slides = await Slider.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: slides.length,
      data: slides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create slide (Admin protected)
exports.createSlide = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      brand_name,
      badge_text,
      image_url,
      price_display,
      space_req,
      cta_text,
      cta_link,
      accent_color,
      is_active,
      order,
    } = req.body;

    if (!title || !brand_name) {
      return res.status(400).json({
        success: false,
        message: "Title and brand_name are required",
      });
    }

    const slide = await Slider.create({
      title,
      subtitle: subtitle || "",
      brand_name: brand_name || "Family Cafe King",
      badge_text: badge_text || "350+ Franchises All Over India",
      image_url:
        image_url ||
        "https://customer-assets-rejwkqb3.emergentagent.net/job_family-cafe-king/artifacts/2q6zxze6_Gemini_Generated_Image_mxlilsmxlilsmxli.png",
      price_display: price_display || "₹5 - 15 Lakhs",
      space_req: space_req || "150 - 500 sq.ft",
      cta_text: cta_text || "Apply for Franchise",
      cta_link: cta_link || "#lead",
      accent_color: accent_color || "#8C1F28",
      is_active: is_active !== undefined ? is_active : true,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: "Hero slide created successfully",
      data: slide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update slide (Admin protected)
exports.updateSlide = async (req, res) => {
  try {
    const slide = await Slider.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found",
      });
    }

    const fields = [
      "title",
      "subtitle",
      "brand_name",
      "badge_text",
      "image_url",
      "price_display",
      "space_req",
      "cta_text",
      "cta_link",
      "accent_color",
      "is_active",
      "order",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        slide[field] = req.body[field];
      }
    });

    await slide.save();

    res.json({
      success: true,
      message: "Hero slide updated successfully",
      data: slide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete slide (Admin protected)
exports.deleteSlide = async (req, res) => {
  try {
    const slide = await Slider.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found",
      });
    }

    await slide.deleteOne();

    res.json({
      success: true,
      message: "Hero slide removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
