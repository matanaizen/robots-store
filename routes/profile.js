const express = require("express");
const router = express.Router();
const Order = require("../models/order");

router.get("/profile", async (req, res) => {
  try {
    const { user } = req.session;
    const orders = await Order.find({ user: user._id })
      .populate("items.product")
      .exec();

    res.render("pages/profile", { orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
