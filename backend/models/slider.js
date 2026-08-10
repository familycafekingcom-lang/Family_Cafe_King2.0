const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Slide title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    brand_name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      default: "Family Cafe King",
    },
    badge_text: {
      type: String,
      default: "350+ Franchises All Over India",
      trim: true,
    },
    image_url: {
      type: String,
      default: "https://customer-assets-rejwkqb3.emergentagent.net/job_family-cafe-king/artifacts/2q6zxze6_Gemini_Generated_Image_mxlilsmxlilsmxli.png",
    },
    price_display: {
      type: String,
      default: "₹5 - 15 Lakhs",
      trim: true,
    },
    space_req: {
      type: String,
      default: "150 - 500 sq.ft",
      trim: true,
    },
    cta_text: {
      type: String,
      default: "Apply for Franchise",
      trim: true,
    },
    cta_link: {
      type: String,
      default: "#lead",
      trim: true,
    },
    accent_color: {
      type: String,
      default: "#8C1F28",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Slider || mongoose.model("Slider", sliderSchema);
