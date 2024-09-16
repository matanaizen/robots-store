const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Category = require("../models/category");
router.get("/admin", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product");
    const categories = await Category.find();
    res.render("pages/admin", { orders });
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
