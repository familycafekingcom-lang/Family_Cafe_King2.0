const express = require("express");
const router = express.Router();
const {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} = require("../controllers/slidercontroller");
const { verifyAdmin } = require("../middleware/auth");

router.get("/", getAllSlides);
router.post("/", verifyAdmin, createSlide);
router.put("/:id", verifyAdmin, updateSlide);
router.delete("/:id", verifyAdmin, deleteSlide);

module.exports = router;
