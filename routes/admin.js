const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Category = require("../models/category");
const Product = require("../models/product");

router.get("/admin", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product");
    const categories = await Category.find();
    const products = await Product.find().populate("category");

    res.render("pages/admin", { orders, categories, products });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/admin/categories", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();

    res.status(201).send("Category added");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.put("/admin/categories/:categoryId", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  try {
    const { name, description } = req.body;
    await Category.findByIdAndUpdate(req.params.categoryId, {
      name,
      description,
    });

    res.status(200).send("Category updated");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.delete("/admin/categories/:categoryId", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  try {
    await Category.findByIdAndDelete(req.params.categoryId);
    await Product.deleteMany({ category: req.params.categoryId });

    res.status(200).send("Category deleted");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/admin/products", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  try {
    const { name, description, price, category, imageUrl } = req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
    });
    await product.save();

    res.status(201).send("Product added");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.put("/admin/products/:productId", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  try {
    const { name, description, price, category, imageUrl } = req.body;
    await Product.findByIdAndUpdate(req.params.productId, {
      name,
      description,
      price,
      category,
      imageUrl,
    });

    res.status(200).send("Product updated");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.delete("/admin/products/:productId", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  try {
    await Product.findByIdAndDelete(req.params.productId);

    res.status(200).send("Product deleted");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
