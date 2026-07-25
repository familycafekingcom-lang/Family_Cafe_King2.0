const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getMe,
  getDashboard,
} = require("../controllers/admincontroller");
const { verifyAdmin } = require("../middleware/auth");

router.post("/login", loginAdmin);
router.get("/me", verifyAdmin, getMe);
router.get("/dashboard", verifyAdmin, getDashboard);

module.exports = router;