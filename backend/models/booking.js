const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      default: "Valued Customer",
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "India",
    },

    outlet: {
      type: String,
      trim: true,
      default: "Family Cafe King",
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },

    bookingTime: {
      type: String,
      default: "12:00 PM",
    },

    totalPersons: {
      type: Number,
      default: 1,
    },

    specialRequest: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);