const express = require("express");
const router = express.Router();

const {
  getAllTraining,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
} = require("../controllers/trainingcontroller");

// Public - get all active packages
router.get("/", getAllTraining);

// Public - get single
router.get("/:id", getTrainingById);

// Admin - create
router.post("/", createTraining);

// Admin - update
router.put("/:id", updateTraining);
router.patch("/:id", updateTraining);

// Admin - delete
router.delete("/:id", deleteTraining);

module.exports = router;
