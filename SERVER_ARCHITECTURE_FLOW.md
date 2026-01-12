# Complete Server Architecture & Flow Guide

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Pages      │  │   API Files  │  │   AuthContext│          │
│  │ StoreDetails │→ │  store.js    │→ │   (Session)  │          │
│  │   Login      │  │  auth.js     │  │              │          │
│  │   Admin      │  │  admin.js    │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Request (fetch)
                            │ credentials: "include"
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express Server)                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  index.js (Entry Point)                                   │  │
│  │  • CORS Middleware                                        │  │
│  │  • Body Parser (JSON)                                     │  │
│  │  • Session Middleware (express-session)                   │  │
│  │  • Route Mounting                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  routes/ (Route Definitions)                              │  │
│  │  • /auth → authRoutes                                     │  │
│  │  • /user → userRoutes                                     │  │
│  │  • /owner → storeOwnerRoutes                              │  │
│  │  • /admin → adminRoutes                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  middleware/ (Auth Guards)                                │  │
│  │  • requireAuth    → Check if user logged in               │  │
│  │  • requireAdmin   → Check if role_id === 1                │  │
│  │  • requireOwner   → Check if role_id === 3                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  controllers/ (Business Logic)                            │  │
│  │  • authController      → Login, Signup, Logout           │  │
│  │  • userController      → Get stores, Add ratings         │  │
│  │  • storeOwnerController → Create stores, View ratings    │  │
│  │  • adminController     → Manage users/stores             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  db.js (Database Connection Pool)                         │  │
│  │  • mysql2/promise connection pool                         │  │
│  │  • getConnection() → use → release()                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                              │
│  • users      → User accounts with roles                        │
│  • stores     → Store information                               │
│  • ratings    → User ratings for stores                         │
│  • roles      → Role definitions (admin, user, store_owner)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 EXAMPLE 1: COMPLETE FLOW - Adding a Rating

### Step-by-Step Flow: User Adds Rating to Store

#### **STEP 1: Frontend - User Action**
**File:** `client/StoreRating/src/pages/StoreDetails.jsx`

```javascript
// User fills form and clicks "Submit Rating"
async function handleAddRating(e) {
  e.preventDefault();
  const res = await addRating(id, Number(score), comment);  // 👈 Calls API
  // ... handle response
}
```

---

#### **STEP 2: Frontend API Call**
**File:** `client/StoreRating/src/api/store.js`

```javascript
export async function addRating(storeId, score, comment) {
  // 👇 Makes HTTP POST request
  const res = await fetch(`http://localhost:3000/user/stores/${storeId}/ratings`, {
    method: "POST",
    credentials: "include",  // 👈 Sends session cookie (sid)
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score, comment }),  // 👈 Request body
  });
  
  return res.json();  // 👈 Returns JSON response
}
```

**What happens:**
- Browser sends POST request to `http://localhost:3000/user/stores/123/ratings`
- Includes session cookie (`sid`) in headers (because `credentials: "include"`)
- Sends JSON body: `{ "score": 5, "comment": "Great store!" }`

---

#### **STEP 3: Backend Entry Point**
**File:** `server/index.js`

```javascript
const app = express();

// 👇 CORS middleware - allows requests from frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true  // 👈 Required for cookies
}));

// 👇 Parses JSON request body into req.body
app.use(express.json());

// 👇 Session middleware - reads/writes session from cookie
app.use(session({
  name: 'sid',  // 👈 Cookie name
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }  // 7 days
}));

// 👇 Mount routes - Request matches /user/* pattern
app.use('/user', userRoutes);  // 👈 Routes to user.js
```

**What happens:**
1. CORS checks origin → ✅ Allows `localhost:5173`
2. Body parser → Extracts JSON into `req.body = { score: 5, comment: "..." }`
3. Session middleware → Reads cookie `sid`, loads session into `req.session`
4. Request matches `/user/*` → Forwards to `routes/user.js`

---

#### **STEP 4: Route Definition**
**File:** `server/routes/user.js`

```javascript
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const userController = require('../controllers/userController');

// 👇 Route matches: POST /user/stores/:id/ratings
router.post('/stores/:id/ratings', requireAuth, userController.addRating);
//                                              │              │
//                                              │              └─ Controller function
//                                              └─ Middleware (runs first!)
```

**What happens:**
1. Route pattern matches: `/stores/:id/ratings` where `:id` = `123`
2. `req.params.id` = `"123"` (from URL)
3. Express calls middleware first: `requireAuth(req, res, next)`

---

#### **STEP 5: Middleware - Authentication Check**
**File:** `server/middleware/requireAuth.js`

```javascript
function requireAuth(req, res, next) {
  // 👇 Check if session exists (set during login)
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // 👇 If authenticated, continue to controller
  next();  // 👈 Calls the next function (userController.addRating)
}
```

**What happens:**
1. Checks `req.session.user` (set by session middleware)
2. If no session → Returns 401 Unauthorized → ❌ Request stops here
3. If session exists → Calls `next()` → ✅ Continues to controller

**Session Structure:**
```javascript
req.session.user = {
  id: 5,
  email: "user@example.com",
  name: "John Doe",
  role_id: 2
}
```

---

#### **STEP 6: Controller - Business Logic**
**File:** `server/controllers/userController.js`

```javascript
exports.addRating = async (req, res, next) => {
  // 👇 Extract data from request
  const { score, comment } = req.body;        // From JSON body
  const storeId = req.params.id;              // From URL: /stores/123/ratings
  const userId = req.session.user.id;         // From session (set during login)
  
  // 👇 Validation
  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ error: 'Invalid score' });
  }
  
  // 👇 Get database connection from pool
  const conn = await pool.getConnection();
  
  try {
    // 👇 Start transaction (all-or-nothing)
    await conn.beginTransaction();
    
    // 👇 Insert rating into database
    await conn.query(
      'INSERT INTO ratings (store_id, user_id, score, comment) VALUES (?, ?, ?, ?)',
      [storeId, userId, score, comment || null]
    );
    
    // 👇 Commit transaction (save changes)
    await conn.commit();
    
    // 👇 Send success response to frontend
    res.status(201).json({ ok: true });
    
  } catch (err) {
    // 👇 If error, rollback transaction (undo changes)
    await conn.rollback();
    
    // 👇 Handle duplicate rating error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'You have already rated this store' });
    }
    
    // 👇 Pass other errors to error handler
    next(err);
    
  } finally {
    // 👇 Always release connection back to pool
    conn.release();
  }
};
```

**What happens:**
1. Extracts data: `score=5`, `comment="Great store!"`, `storeId=123`, `userId=5`
2. Validates score is 1-5
3. Gets database connection from pool
4. Starts transaction (atomic operation)
5. Executes SQL: `INSERT INTO ratings ...`
6. Commits transaction
7. Returns JSON: `{ ok: true }`
8. Releases connection back to pool

**If error:**
- Duplicate rating → Returns 400 error
- Other errors → Passes to error handler (in `index.js`)

---

#### **STEP 7: Database Operation**
**File:** `server/db.js` (Connection Pool)

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // Max 10 concurrent connections
  queueLimit: 0
});

module.exports = pool;
```

**What happens:**
1. Pool provides connection from available connections
2. Executes SQL query on MySQL database
3. Database inserts row into `ratings` table:
   ```sql
   INSERT INTO ratings (store_id, user_id, score, comment)
   VALUES (123, 5, 5, 'Great store!')
   ```
4. Returns result (insertId, affectedRows, etc.)

---

#### **STEP 8: Response Back to Frontend**

**Flow reverses:**
1. Controller sends: `res.status(201).json({ ok: true })`
2. Express sends HTTP response:
   ```
   HTTP/1.1 201 Created
   Content-Type: application/json
   Set-Cookie: sid=... (if session updated)
   
   { "ok": true }
   ```
3. Frontend receives response in `addRating()` function
4. `StoreDetails.jsx` handles response and refreshes store data

---

## 🔐 EXAMPLE 2: LOGIN FLOW (Session Creation)

### Complete Login Flow

#### **Frontend: Login.jsx**
```javascript
const data = await login(email, password);
setUser(data.user);  // Updates AuthContext
navigate("/owner");  // Redirects based on role_id
```

#### **API: auth.js**
```javascript
fetch(`${API}/auth/login`, {
  method: "POST",
  credentials: "include",
  body: JSON.stringify({ email, password })
});
```

#### **Route: routes/auth.js**
```javascript
router.post('/login', authController.login);  // No middleware needed
```

#### **Controller: authController.js**
```javascript
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  
  // 1. Query database for user
  const [rows] = await conn.query(
    'SELECT id, email, password_hash, name, role_id FROM users WHERE email = ?',
    [email]
  );
  
  // 2. Verify password with bcrypt
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  
  // 3. ✅ CREATE SESSION (This is the key step!)
  req.session.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role_id: user.role_id
  };
  
  // 4. Send user data back
  res.json({ user: req.session.user });
  
  // 👇 Express-session automatically:
  // - Creates session ID
  // - Stores session in MemoryStore
  // - Sends Set-Cookie header with session ID
  // - Browser stores cookie
};
```

**What happens:**
1. User submits email/password
2. Database query finds user
3. bcrypt verifies password hash
4. **Session created** → `req.session.user = {...}`
5. Express-session sends `Set-Cookie: sid=abc123...`
6. Browser stores cookie
7. All future requests include this cookie automatically
8. Frontend stores user in context

---

## 🔒 EXAMPLE 3: Protected Route (Admin)

### Admin Getting All Users

#### **Frontend: AdminUsers.jsx**
```javascript
const users = await getAdminUsers();  // Calls API
```

#### **API: admin.js**
```javascript
fetch(`${API}/admin/users`, {
  credentials: "include"  // Sends session cookie
});
```

#### **Route: routes/admin.js**
```javascript
router.get('/users', requireAdmin, adminController.getAllUsers);
//                      │          │
//                      │          └─ Controller function
//                      └─ Middleware (checks role_id === 1)
```

#### **Middleware: requireAdmin.js**
```javascript
function requireAdmin(req, res, next) {
  // 👇 Check if logged in AND role is admin
  if (!req.session.user || req.session.user.role_id !== 1) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();  // Continue to controller
}
```

#### **Controller: adminController.js**
```javascript
exports.getAllUsers = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    // 👇 Query all users (no WHERE clause - admin sees all)
    const [users] = await conn.query(
      'SELECT id, email, name, role_id, created_at FROM users ORDER BY id DESC'
    );
    res.json(users);  // Send array of users
  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
};
```

**Flow:**
1. Request includes session cookie
2. Session middleware loads `req.session.user`
3. `requireAdmin` checks `role_id === 1`
4. If not admin → 403 Forbidden
5. If admin → Controller executes
6. Returns all users from database

---

## 🎯 KEY CONCEPTS

### 1. **Request Flow Order**
```
Request → index.js (middleware) → Route → Middleware → Controller → Database → Response
```

### 2. **Session vs Authentication**
- **Session** = Cookie stored in browser, managed by express-session
- **Authentication** = Checking if session exists (`req.session.user`)
- **Authorization** = Checking user's role (`role_id`)

### 3. **Middleware Chain**
```javascript
// Middleware executes in order:
router.post('/stores/:id/ratings', requireAuth, userController.addRating);
//                                  │         │
//                                  │         └─ Executes 2nd
//                                  └─ Executes 1st (must call next())
```

### 4. **Database Connection Pattern**
```javascript
const conn = await pool.getConnection();  // Get connection
try {
  // Use connection
  await conn.query('SELECT ...');
} catch (err) {
  // Handle errors
} finally {
  conn.release();  // ⚠️ ALWAYS release connection
}
```

### 5. **Transaction Pattern** (for critical operations)
```javascript
await conn.beginTransaction();  // Start transaction
try {
  await conn.query('INSERT ...');
  await conn.commit();  // ✅ Save all changes
} catch (err) {
  await conn.rollback();  // ❌ Undo all changes
}
```

### 6. **Error Handling**
```javascript
// In controller:
catch (err) {
  next(err);  // Passes to error handler in index.js
}

// In index.js:
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'something went wrong' });
});
```

---

## 📊 REQUEST/RESPONSE EXAMPLES

### GET Store Details (Public)
```
Request:
  GET /user/stores/123
  Cookie: sid=abc123...

Response:
  200 OK
  {
    "store": { "id": 123, "name": "Store Name", ... },
    "ratings": [ { "id": 1, "score": 5, "user_name": "John", ... } ]
  }
```

### POST Add Rating (Protected)
```
Request:
  POST /user/stores/123/ratings
  Cookie: sid=abc123...
  Body: { "score": 5, "comment": "Great!" }

Response (Success):
  201 Created
  { "ok": true }

Response (Error - Not Logged In):
  401 Unauthorized
  { "error": "Unauthorized" }

Response (Error - Already Rated):
  400 Bad Request
  { "error": "You have already rated this store" }
```

### GET Admin Users (Admin Only)
```
Request:
  GET /admin/users
  Cookie: sid=xyz789... (must be admin)

Response (Success):
  200 OK
  [ { "id": 1, "email": "...", "role_id": 1 }, ... ]

Response (Error - Not Admin):
  403 Forbidden
  { "error": "Forbidden" }
```

---

## 🗂️ FILE STRUCTURE SUMMARY

### Controllers (`controllers/`)
- **Purpose**: Business logic, database operations
- **Returns**: JSON responses
- **Pattern**: Extract from `req`, validate, query DB, respond

### Routes (`routes/`)
- **Purpose**: Define URL patterns and map to controllers
- **Also**: Apply middleware (auth guards)
- **Pattern**: `router.METHOD('/path', middleware, controller)`

### Middleware (`middleware/`)
- **Purpose**: Intercept requests, check auth/roles
- **Pattern**: Check condition, call `next()` or return error

### Entry Point (`index.js`)
- **Purpose**: Server setup, global middleware, route mounting
- **Also**: Error handler, port listening

### Database (`db.js`)
- **Purpose**: Connection pool configuration
- **Exports**: Pool instance used by all controllers

---

This is the complete architecture and flow of your server! 🎉