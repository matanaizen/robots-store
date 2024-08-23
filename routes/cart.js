const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.post("/cart", async (req, res) => {
  const cart = req.session.cart || [];
  const productId = req.body.productId;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).send("Product not found");
  }

  const existingProduct = cart.find(
    (item) => item.productId === product._id.toString()
  );
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ productId: product._id.toString(), quantity: 1, product });
  }

  req.session.cart = cart;
  res.status(200).send("Product added to cart");
});

router.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  res.render("pages/cart", { cart });
});

router.post("/cart/update", (req, res) => {
  const cart = req.session.cart || [];
  const { productId, quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res
      .status(400)
      .send("Invalid quantity. Please enter a number greater than 0.");
  }

  const existingProduct = cart.find((item) => item.productId === productId);
  if (existingProduct) {
    existingProduct.quantity = parseInt(quantity, 10);
  }

  req.session.cart = cart;
  res.status(200).send("Quantity updated");
});

router.post("/cart/remove", (req, res) => {
  const cart = req.session.cart || [];
  const { productId } = req.body;

  const updatedCart = cart.filter((item) => item.productId !== productId);

  req.session.cart = updatedCart;
  res.status(200).send("Product removed from cart");
});

module.exports = router;
