const Booking = require("../models/booking");

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const {
      name,
      customerName,
      phone,
      email,
      city,
      budget,
      brand,
      outlet,
      date,
      bookingDate,
      time,
      bookingTime,
      guests,
      totalPersons,
      notes,
      specialRequest,
    } = req.body;

    const resolvedName = customerName || name || "Valued Customer";

    const booking = await Booking.create({
      customerName: resolvedName,
      name: resolvedName,
      phone: phone || "",
      email: email || "",
      city: city || "",
      budget: budget || "",
      outlet: outlet || brand || "Family Cafe King",
      brand: brand || outlet || "Family Cafe King",
      bookingDate: bookingDate || date || new Date(),
      bookingTime: bookingTime || time || "12:00 PM",
      totalPersons: Number(totalPersons || guests || 1),
      specialRequest: specialRequest || notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Booking Created Successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Booking
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking Not Found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Booking Status
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Booking
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};