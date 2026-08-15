const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: String,
      trim: true,
      default: "Immediate",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    brand: {
      type: String,
      trim: true,
      default: "Staff Training & Support",
    },

    budget: {
      type: String,
      trim: true,
      default: "₹1.5 Lakh (+ Trainer Expenses)",
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Confirmed", "Completed", "Cancelled"],
      default: "New",
    },

    heading: {
      type: String,
      default: "Staff Training & Support",
      trim: true,
    },

    sub_heading: {
      type: String,
      default: "Food Training Support (Pan India)",
      trim: true,
    },

    food_categories: {
      type: [String],
      default: ["Only Veg & Indian", "Fast Food", "Mocktails"],
    },

    time_period: {
      type: String,
      default: "6 Months Hotel Visit",
      trim: true,
    },

    base_cost: {
      type: String,
      default: "₹1.5 Lakh Training Charge",
      trim: true,
    },

    extra_costs: {
      type: [String],
      default: ["Travel Expenses of Trainer", "Stay & Food for Trainer"],
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

module.exports =
  mongoose.models.Training || mongoose.model("Training", trainingSchema);

