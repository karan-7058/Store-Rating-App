const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register - GET
router.get("/register", (req, res) => {
  res.render("register");
});

// Register - POST
router.post("/register", async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, address, password: hash, role });
  await user.save();
  res.redirect("/login");
});

// Login - GET
router.get("/login", (req, res) => {
  res.render("login");
});

// Login - POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
   

    if (user.role === "admin") {
      return res.redirect("/admin/dashboard");
    } else if (user.role === "storeowner") {
      return res.redirect("/storeowner/dashboard");
    } else {
      return res.redirect("/user/dashboard");
    }
  
  }
  
  res.send("Invalid credentials");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});


//this route is for updating user password

// Update Password - GET
router.get("/update-password", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("update-password", { message: null });
});

// Update Password - POST
router.post("/update-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.session.user) return res.redirect("/login");

  const user = await User.findById(req.session.user._id);
  const match = await bcrypt.compare(currentPassword, user.password);

  if (!match) {
    return res.render("update-password", { message: "❌ Current password is incorrect." });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.render("update-password", { message: "✅ Password updated successfully." });
});


module.exports = router;
