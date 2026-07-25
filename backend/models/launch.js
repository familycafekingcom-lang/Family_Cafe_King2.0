const mongoose = require("mongoose");

const launchSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      default: "Family Cafe King",
    },
    date_text: {
      type: String,
      required: [true, "Date description is required"],
      trim: true,
    },
    image_data: {
      type: String,
      default: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000",
    },
    tag: {
      type: String,
      default: "Coming Soon",
    },
    accent: {
      type: String,
      default: "#8C1F28",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Launch || mongoose.model("Launch", launchSchema);
