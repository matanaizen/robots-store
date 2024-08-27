const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const User = require("../models/user");

router.post("/checkout", async (req, res) => {
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.status(400).send("Cart is empty");
  }
    res.status(200).send("Order completed");
});

module.exports = router;
