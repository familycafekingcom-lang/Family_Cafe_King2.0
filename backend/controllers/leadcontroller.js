const Lead = require("../models/lead");

// ==============================
// Create Lead
// ==============================
exports.createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      city,
      brand,
      budget,
      source_page,
    } = req.body;

    if (!name || !phone || !city || !brand || !budget) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      city,
      brand,
      budget,
      source_page: source_page || "Website",
    });

    res.status(201).json({
      success: true,
      message: "Lead Submitted Successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Leads
// ==============================
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Single Lead
// ==============================
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Lead
// ==============================
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead Updated Successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Lead
// ==============================
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead Not Found",
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};