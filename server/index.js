// minimal Express server: sessions (MemoryStore), CORS for dev, and routes
const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const storeOwnerRoutes = require('./routes/storeowner');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // change if you use a different dev port
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
}));

// Routes mounted similar to original app.js
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/owner', storeOwnerRoutes);


app.get('/', (req, res) => {

  res.json("Welcome to the Store Rating API");
});

// simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  const { status = 500, message = 'something went wrong' } = err;
  res.status(status).json({ error: message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));