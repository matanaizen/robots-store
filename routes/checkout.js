const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const User = require("../models/user");

router.post("/checkout", async (req, res) => {
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.status(400).send("Cart is empty");
  }

  try {
    let user = req.session.user;
    const userById = await User.findById(user._id);

    if (!userById) {
      user = await User.findOne({ email: user.email });
    }

    const order = new Order({
      user: user._id,
      items: cart,
      totalAmount: Number(
        cart.reduce(
          (total, item) => total + item.quantity * item.product.price,
          0
        )
      ).toFixed(2),
    });

    await order.save();
    req.session.cart = [];

    res.status(200).send("Order completed");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
