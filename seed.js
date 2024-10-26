const mongoose = require("mongoose");
const Category = require("./models/category");
const Product = require("./models/product");
const Order = require("./models/order");
const User = require("./models/user");
const Branch = require("./models/branch");

const initDb = async function () {
  await mongoose
  .connect("mongodb://matan:123456@localhost:27017/robots-db?authSource=admin")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  await Category.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await User.deleteMany({});
  await Branch.deleteMany({});

  const category1 = new Category({
    name: "Regular Robots",
    description: "Standard robots with various functionalities",
  });

  const category2 = new Category({
    name: "Alien Robots",
    description: "Robots with alien origins and advanced technologies",
  });

  await category1.save();
  await category2.save();

  const products = [
    {
      name: "Model X1",
      description: "A high-performance robot with standard AI capabilities.",
      price: 299.99,
      category: category1._id,
      imageUrl: "https://robohash.org/model-x1?set=set1",
    },
    {
      name: "Model Z3",
      description: "A versatile robot suitable for various tasks.",
      price: 349.99,
      category: category1._id,
      imageUrl: "https://robohash.org/model-z3?set=set1",
    },
    {
      name: "Regular Bot Y7",
      description: "A reliable and efficient robot for everyday use.",
      price: 319.99,
      category: category1._id,
      imageUrl: "https://robohash.org/regular-bot-y7?set=set1",
    },
    {
      name: "Regular Bot Q5",
      description: "An advanced robot with extended battery life.",
      price: 399.99,
      category: category1._id,
      imageUrl: "https://robohash.org/regular-bot-q5?set=set1",
    },
    {
      name: "Regular Bot A2",
      description: "A budget-friendly robot with basic functionality.",
      price: 199.99,
      category: category1._id,
      imageUrl: "https://robohash.org/regular-bot-a2?set=set1",
    },
    {
      name: "Helper Bot H2",
      description: "A robot designed to assist with household chores.",
      price: 249.99,
      category: category1._id,
      imageUrl: "https://robohash.org/helper-bot-h2?set=set1",
    },
    {
      name: "Security Bot S1",
      description: "A robot equipped with advanced security features.",
      price: 459.99,
      category: category1._id,
      imageUrl: "https://robohash.org/security-bot-s1?set=set1",
    },
    {
      name: "Medical Bot M3",
      description: "A robot designed to provide basic medical assistance.",
      price: 599.99,
      category: category1._id,
      imageUrl: "https://robohash.org/medical-bot-m3?set=set1",
    },
    {
      name: "Gardening Bot G4",
      description: "A robot that helps maintain gardens and landscapes.",
      price: 289.99,
      category: category1._id,
      imageUrl: "https://robohash.org/gardening-bot-g4?set=set1",
    },
    {
      name: "Chef Bot C5",
      description: "A robot that can cook a variety of meals.",
      price: 529.99,
      category: category1._id,
      imageUrl: "https://robohash.org/chef-bot-c5?set=set1",
    },
    {
      name: "Teacher Bot T6",
      description: "An educational robot that helps with learning.",
      price: 479.99,
      category: category1._id,
      imageUrl: "https://robohash.org/teacher-bot-t6?set=set1",
    },
    {
      name: "Alien Bot A1",
      description: "A mysterious alien robot with unknown powers.",
      price: 499.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-a1?set=set3",
    },
    {
      name: "Alien Bot Z9",
      description: "A highly advanced alien robot with powerful abilities.",
      price: 599.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-z9?set=set3",
    },
    {
      name: "Alien Bot X2",
      description: "An alien robot with advanced sensory capabilities.",
      price: 569.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-x2?set=set3",
    },
    {
      name: "Alien Bot R4",
      description: "A fast and agile alien robot designed for combat.",
      price: 629.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-r4?set=set3",
    },
    {
      name: "Alien Bot V6",
      description: "A stealthy alien robot with cloaking abilities.",
      price: 699.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-v6?set=set3",
    },
    {
      name: "Alien Bot P7",
      description: "A robotic alien that specializes in teleportation.",
      price: 759.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-p7?set=set3",
    },
    {
      name: "Alien Bot B8",
      description: "An alien robot with bioengineering capabilities.",
      price: 629.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-b8?set=set3",
    },
    {
      name: "Alien Bot T1",
      description: "A time-traveling alien robot.",
      price: 799.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-t1?set=set3",
    },
    {
      name: "Alien Bot G5",
      description: "A gravity-defying alien robot.",
      price: 679.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-g5?set=set3",
    },
    {
      name: "Alien Bot C3",
      description: "An alien robot with camouflage capabilities.",
      price: 649.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-c3?set=set3",
    },
    {
      name: "Alien Bot L9",
      description: "A light-speed alien robot.",
      price: 849.99,
      category: category2._id,
      imageUrl: "https://robohash.org/alien-bot-l9?set=set3",
    },
  ];

  await Product.insertMany(products);

  const matan = new User({
    name: "Matan Eizenberg",
    email: "matan@example.com",
    password: "123456",
    isAdmin: true,
  });

  const john = new User({
    name: "Optimus Prime",
    email: "optimus@example.com",
    password: "password",
    isAdmin: false,
  });

  await matan.save();
  await john.save();

  const branches = [
    {
      name: "Tel Aviv",
      address: "Dizengoff St 50, Tel Aviv, Israel",
      phone: "03-1234567",
      lat: 32.0751081,
      lng: 34.7749424,
    },
    {
      name: "Modiin",
      address: "Emek HaEla St 10, Modiin Maccabim Reut, Israel",
      phone: "08-7654321",
      lat: 31.9120057,
      lng: 35.0126382,
    },
    {
      name: "Rishon LeZion",
      address: "Rothschild St 15, Rishon LeZion, Israel",
      phone: "03-9876543",
      lat: 31.9639228,
      lng: 34.805232,
    },
  ];

  await Branch.insertMany(branches);

  console.log(
    "Database seeded with categories, products, users, and branches!"
  );
};

initDb();