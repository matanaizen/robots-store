const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Product = require("../models/product");

router.get("/category/:categoryId", async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    const products = await Product.find({ category: req.params.categoryId });

    res.render("pages/category", { category, products });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

