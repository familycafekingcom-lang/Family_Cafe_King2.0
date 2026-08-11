const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    city: {
      type: String,
      default: "N/A",
      trim: true,
    },

    brand: {
      type: String,
      default: "Family Cafe King",
    },

    budget: {
      type: String,
      default: "Standard",
      trim: true,
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Converted", "Lost"],
      default: "New",
    },

    notes: {
      type: String,
      default: "",
    },

    source_page: {
      type: String,
      default: "Website",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Lead || mongoose.model("Lead", leadSchema);