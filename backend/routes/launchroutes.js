const express = require("express");
const router = express.Router();
const {
  getAllLaunches,
  createLaunch,
  deleteLaunch,
} = require("../controllers/launchcontroller");
const { verifyAdmin } = require("../middleware/auth");

router.get("/", getAllLaunches);
router.post("/", verifyAdmin, createLaunch);
router.delete("/:id", verifyAdmin, deleteLaunch);

module.exports = router;
