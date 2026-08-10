const Admin = require("../models/admin");
const Lead = require("../models/lead");
const Booking = require("../models/booking");
const Contact = require("../models/contact");
const Launch = require("../models/launch");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Generate JWT Token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id || "admin_123", email: admin.email, role: admin.role || "admin" },
    process.env.JWT_SECRET || "familycafeking_secret",
    { expiresIn: "7d" }
  );
};

// Seed default admins if MongoDB is connected
const seedDefaultAdmin = async () => {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const primaryEmail = (process.env.ADMIN_EMAIL || "shivamsri.srivastava2@gmail.com").toLowerCase().trim();
    const primaryPass = process.env.ADMIN_PASSWORD || "Shivam@1234";

    const existingPrimary = await Admin.findOne({ email: primaryEmail });
    if (!existingPrimary) {
      await Admin.create({
        name: "Family Cafe King Admin",
        email: primaryEmail,
        password: primaryPass,
        role: "admin",
      });
      console.log(`🔑 Primary admin account created in MongoDB: ${primaryEmail}`);
    }

    const legacyEmail = "admin@familycafeking.com";
    const existingLegacy = await Admin.findOne({ email: legacyEmail });
    if (!existingLegacy) {
      await Admin.create({
        name: "Family Cafe King Admin",
        email: legacyEmail,
        password: "admin123",
        role: "admin",
      });
    }
  } catch (err) {
    console.warn("Notice: Default admin seed skipped:", err.message);
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const defaultEmail = (process.env.ADMIN_EMAIL || "shivamsri.srivastava2@gmail.com").toLowerCase().trim();
    const defaultPassword = process.env.ADMIN_PASSWORD || "Shivam@1234";
    const inputEmail = email.toLowerCase().trim();

    // Check if MongoDB is live and connected
    if (mongoose.connection.readyState === 1) {
      try {
        await seedDefaultAdmin();

        const admin = await Admin.findOne({
          email: { $in: [inputEmail, defaultEmail] },
        });

        if (admin) {
          const isMatch = await admin.comparePassword(password);
          if (isMatch) {
            admin.lastLogin = new Date();
            await admin.save();

            const token = generateToken(admin);

            res.cookie("admin_token", token, {
              httpOnly: true,
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({
              success: true,
              message: "Login successful",
              token,
              admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                lastLogin: admin.lastLogin,
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn("DB login lookup fallback:", dbErr.message);
      }
    }

    // Fallback: Validate default admin credentials when DB is connecting, offline, or fallback mode
    const isValidPrimary =
      (inputEmail === defaultEmail || inputEmail === "shivamsri.srivastava2@gmail.com") &&
      password === defaultPassword;
    const isValidLegacy =
      (inputEmail === "admin@familycafeking.com" || inputEmail === "admin") &&
      (password === "admin123" || password === defaultPassword);

    if (isValidPrimary || isValidLegacy) {
      const fallbackAdmin = {
        _id: "admin_static_1",
        name: "Family Cafe King Admin",
        email: inputEmail.includes("@") ? inputEmail : defaultEmail,
        role: "admin",
        lastLogin: new Date(),
      };

      const token = generateToken(fallbackAdmin);

      res.cookie("admin_token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: "Login successful (Admin Mode)",
        token,
        admin: {
          id: fallbackAdmin._id,
          name: fallbackAdmin.name,
          email: fallbackAdmin.email,
          role: fallbackAdmin.role,
          lastLogin: fallbackAdmin.lastLogin,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current admin user details
exports.getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && req.admin.id !== "admin_static_1") {
      try {
        const admin = await Admin.findById(req.admin.id).select("-password");
        if (admin) {
          return res.json({
            success: true,
            admin: {
              id: admin._id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
              lastLogin: admin.lastLogin,
            },
          });
        }
      } catch {
        // Ignore fallback
      }
    }

    res.json({
      success: true,
      admin: {
        id: "admin_static_1",
        name: "Family Cafe King Admin",
        email: req.admin.email || "admin@familycafeking.com",
        role: "admin",
        lastLogin: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Dashboard Overview Metrics
exports.getDashboard = async (req, res) => {
  try {
    let totalLeads = 0;
    let totalBookings = 0;
    let totalContacts = 0;
    let totalLaunches = 0;
    let leads = [];

    if (mongoose.connection.readyState === 1) {
      try {
        [totalLeads, totalBookings, totalContacts, totalLaunches, leads] =
          await Promise.all([
            Lead.countDocuments().catch(() => 0),
            Booking.countDocuments().catch(() => 0),
            Contact.countDocuments().catch(() => 0),
            Launch.countDocuments().catch(() => 0),
            Lead.find().sort({ createdAt: -1 }).catch(() => []),
          ]);
      } catch (err) {
        console.warn("Dashboard metrics DB fallback:", err.message);
      }
    }

    const statusCounts = {
      New: 0,
      Contacted: 0,
      Interested: 0,
      Converted: 0,
      Lost: 0,
    };

    leads.forEach((l) => {
      const st = l.status || "New";
      if (statusCounts[st] !== undefined) {
        statusCounts[st]++;
      }
    });

    res.json({
      success: true,
      stats: {
        totalLeads,
        newLeads: statusCounts.New,
        contactedLeads: statusCounts.Contacted,
        interestedLeads: statusCounts.Interested,
        convertedLeads: statusCounts.Converted,
        lostLeads: statusCounts.Lost,
        totalBookings,
        totalContacts,
        totalLaunches,
      },
      recentLeads: leads.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};