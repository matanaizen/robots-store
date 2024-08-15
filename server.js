const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const seedDatabase = require("./seed");


const userRoutes = require("./routes/user");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(
  session({
    secret: "0d0eb7171b6dfc903e630e8dd93470f599570aef21c8cd82fb9fd425cf64b3e3",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb://matan:123456@localhost:27017/anime-db?authSource=admin",
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(userRoutes);

mongoose
  .connect("mongodb://matan:123456@localhost:27017/anime-db?authSource=admin")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.get("/", checkLoggedInUser, async (req, res) => {
  const categories = await Category.find({});
  const products = await Product.find({}).populate("category");
  res.render("pages/index", { categories, products });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

seedDatabase();
