const express = require("express");
const router = express.Router();
const {
  getAllLaunches,
  createLaunch,
  updateLaunch,
  deleteLaunch,
} = require("../controllers/launchcontroller");
const { verifyAdmin } = require("../middleware/auth");

router.get("/", getAllLaunches);
router.post("/", verifyAdmin, createLaunch);
router.put("/:id", verifyAdmin, updateLaunch);
router.delete("/:id", verifyAdmin, deleteLaunch);

module.exports = router;
