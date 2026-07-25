const express = require("express");
const router = express.Router();

const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadcontroller");

// Create Lead (Public customer inquiry)
router.post("/", createLead);

// Get All Leads (Admin or Public fetch)
router.get("/", getAllLeads);

// Get Single Lead
router.get("/:id", getLeadById);

// Update Lead (Status / Notes)
router.put("/:id", updateLead);
router.patch("/:id", updateLead);

// Delete Lead
router.delete("/:id", deleteLead);

module.exports = router;