const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

    subject: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      required: [true, "Message is required"],
    },

    status: {
      type: String,
      enum: ["New", "Replied", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Contact || mongoose.model("Contact", contactSchema);