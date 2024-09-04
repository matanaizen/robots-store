const express = require("express");
const router = express.Router();
const Branch = require("../models/branch");
const axios = require("axios");

const apiKey = "2fa6bb3510c31ca12e805a9ef4bde609";

async function getWeather(city) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
    return null;
  }
}

router.get("/about", async (req, res) => {
  try {
    const branches = await Branch.find({});

    const branchesWithWeather = await Promise.all(
      branches.map(async (branch) => {
        const weather = await getWeather(branch.name);
        return { ...branch.toObject(), weather };
      })
    );

    res.render("pages/about", {
      branches: branchesWithWeather,
      apiKey: process.env.GOOGLE_MAPS_API_KEY
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/branches", async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.json(branches);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
