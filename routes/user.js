const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/login", (_req, res) => {
  res.render("pages/login");
});

router.get("/register", (_req, res) => {
  res.render("pages/register");
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const user = new User({ name, email, password });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    req.session.user = user;
    res.status(200).send("Login successful");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    res.redirect("/");
  });
});

module.exports = router;
