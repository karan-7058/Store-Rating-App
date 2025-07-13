const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const User = require("../models/User");

function isStoreOwner(req, res, next) {
  if (req.session.user?.role === "storeowner") return next();
  res.redirect("/login");
}

// Store Owner Dashboard
router.get("/storeowner/dashboard", isStoreOwner, async (req, res) => {
  const ownerId = req.session.user._id;

  const store = await Store.findOne({ owner: ownerId });

  if (!store) {
    return res.render("storeowner/dashboard", {
      user: req.session.user,
      store: null,
      ratings: [],
      avgRating: null
    });
  }

  const ratings = await Rating.find({ store: store._id }).populate("user");

  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2)
      : "N/A";

  res.render("storeowner/dashboard", {
    user: req.session.user,
    store,
    ratings,
    avgRating
  });
});

module.exports = router;
