const mongoose =require('mongoose');
const express=require('express');
const app=express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/auth");
const path = require("path");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const storeOwnerRoutes = require("./routes/storeowner");
const expressLayouts = require("express-ejs-layouts");




app.use(expressLayouts);
app.set("layout", "layouts/boilerplate"); // use your layout file
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "secretKey123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/storeRatingApp" })
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.get("/", (req, res) => {
  res.render("home", { user: req.session.user });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


//use admin routes
app.use("/", adminRoutes);

//use user routes
app.use("/", userRoutes);

//use auth routes
app.use("/", authRoutes);

//use store owner routes
app.use("/", storeOwnerRoutes);








//mongoDB connection
const MONGO_URL="mongodb://127.0.0.1:27017/storeRatingApp";

main().then((res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}