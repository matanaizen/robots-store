const express = require("express");
const router = express.Router();
const Order = require("../models/order");
router.get("/admin", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product");
    res.render("pages/admin", { orders });
  } catch (error) {
    res.status(500).send("Server error");
  }
});
