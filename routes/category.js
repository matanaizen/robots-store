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

router.get("/category/:id/search", async (req, res) => {
  const categoryId = req.params.id;
  const query = req.query.query || "";

  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice
    ? parseFloat(req.query.maxPrice)
    : Infinity;

  try {
    const searchCriteria = {
      category: categoryId,
    };

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      searchCriteria.price = {};
      if (req.query.minPrice) {
        searchCriteria.price.$gte = minPrice;
      }
      if (req.query.maxPrice) {
        searchCriteria.price.$lte = maxPrice;
      }
    }

    const results = await Product.find(searchCriteria);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
