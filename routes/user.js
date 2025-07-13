const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const Rating = require("../models/Rating");

function isUser(req, res, next) {
  if (req.session.user?.role === "user") {
    return next();
  }
  return res.redirect("/login");
}

// User Dashboard - Store List with Ratings
router.get("/user/dashboard", isUser, async (req, res) => {
  const { name, address } = req.query;
  const filter = {};

  if (name) filter.name = new RegExp(name, "i");
  if (address) filter.address = new RegExp(address, "i");

  const stores = await Store.find(filter);
  const storeData = await Promise.all(
    stores.map(async (store) => {
      const ratings = await Rating.find({ store: store._id });
      const userRating = await Rating.findOne({ store: store._id, user: req.session.user._id });

      const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2)
        : "N/A";

      return {
        _id: store._id,
        name: store.name,
        address: store.address,
        avgRating,
        userRating: userRating ? userRating.value : null
      };
    })
  );

  res.render("user/dashboard", {
    user: req.session.user,
    stores: storeData,
    filters: req.query
  });
});

// User Store Rating
router.post("/user/rate", isUser, async (req, res) => {
  const { storeId, value } = req.body;
  const userId = req.session.user._id;

  const existing = await Rating.findOne({ store: storeId, user: userId });

  if (existing) {
    existing.value = value;
    await existing.save();
  } else {
    await Rating.create({ store: storeId, user: userId, value });
  }

  res.redirect("/user/dashboard");
});


module.exports = router;
