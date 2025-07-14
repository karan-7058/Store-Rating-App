const express = require("express");
const router = express.Router();
const User= require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

function isAdmin(req, res, next) {
  if (req.session.user?.role === "admin") {
    return next();
  }
  return res.redirect("/login");
}

// Admin Dashboard
router.get("/admin/dashboard", isAdmin, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalStores = await Store.countDocuments();
  const totalRatings = await Rating.countDocuments();

  res.render("admin/dashboard", {
    user: req.session.user,
    totalUsers,
    totalStores,
    totalRatings
  });
});


// Add Store - GET
router.get("/admin/add-store", isAdmin, async (req, res) => {
  const owners = await User.find({ role: "storeowner" });
  res.render("admin/add-store", { owners });
});

// Add Store - POST
router.post("/admin/add-store", isAdmin, async (req, res) => {
  const { name, email, address, owner } = req.body;
  const store = new Store({ name, email, address, owner });
  await store.save();
  res.redirect("/admin/dashboard");
});

// add users
// Add User - GET
router.get("/admin/add-user", isAdmin, (req, res) => {
  res.render("admin/add-user");
});

// Add User - POST
router.post("/admin/add-user", isAdmin, async (req, res) => {
  const { name, email, address, password, role } = req.body;
  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await User.create({
    name,
    email,
    address,
    password: hashedPassword,
    role
  });

  res.redirect("/admin/dashboard");
});


// View All Users (with filters)
router.get("/admin/users", isAdmin, async (req, res) => {
  const { name, email, address, role, sort = "name", order = "asc" } = req.query;
  const filter = {};

  if (name) filter.name = new RegExp(name, "i");
  if (email) filter.email = new RegExp(email, "i");
  if (address) filter.address = new RegExp(address, "i");
  if (role) filter.role = role;

  const sortOrder = order === "desc" ? -1 : 1;
  const users = await User.find(filter).sort({ [sort]: sortOrder });

  res.render("admin/user-list", {
    users,
    filters: req.query,
    sortField: sort,
    sortOrder: order
  });
});


// View All Stores (with filters + ratings)
router.get("/admin/stores", isAdmin, async (req, res) => {
  const { name, email, address, sort = "name", order = "asc" } = req.query;
  const filter = {};

  if (name) filter.name = new RegExp(name, "i");
  if (email) filter.email = new RegExp(email, "i");
  if (address) filter.address = new RegExp(address, "i");

  const sortOrder = order === "desc" ? -1 : 1;
  const stores = await Store.find(filter).sort({ [sort]: sortOrder });

  const storeData = await Promise.all(
    stores.map(async (store) => {
      const ratings = await Rating.find({ store: store._id });
      const avgRating =
        ratings.length > 0
          ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2)
          : "N/A";

      return {
        _id: store._id,
        name: store.name,
        email: store.email,
        address: store.address,
        avgRating
      };
    })
  );

  res.render("admin/store-list", {
    stores: storeData,
    filters: req.query,
    sortField: sort,
    sortOrder: order
  });
});


//delete user
router.post('/users/:id/delete', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.role === 'admin') {
      return res.status(403).send('Cannot delete admin user');
    }

    await user.deleteOne(); // triggers post middleware
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
});






module.exports = router;
