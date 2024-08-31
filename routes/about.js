const express = require("express");
const router = express.Router();
const Branch = require("../models/branch");
router.get("/about", async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.render("pages/about", { branches });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/branches", async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.json(branches);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
