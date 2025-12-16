# Store Rating App

A simple web application to list stores and collect user ratings & reviews. This repository follows a client/server architecture:

- Client: React (in `client/`)
- Server: Express (in `server/`)
- Database: MySQL

This README describes how to run the project locally, how the pieces fit together, example API endpoints, and DB schema you can adapt.


## Features

- Browse stores (name, description, images, category)
- Submit rating (1–5) and review for a store
- Aggregated average rating per store
- User auth (register / login) with JWT
- Admin endpoints for store management
- Search, pagination, and basic filtering

---

## Tech stack & architecture

- Frontend: React (Create React App / Vite - adjust to your setup)
- Backend: Node.js + Express
- Database: MySQL (InnoDB)
- Auth: JWT tokens
- Optional ORM: Sequelize / Knex (instructions below include both raw SQL and ORM guidance)
- Optional: Docker + docker-compose for local development

The client sends HTTP requests to the server's REST API. The server stores users, stores and ratings in MySQL.

---

## Repository layout

(Adjust if your project uses different names.)

- client/ — React application (frontend)
- server/ — Express API (backend)
- README.md — this file
- .gitignore, docker-compose.yml, etc.

---

## Prerequisites

- Node.js 16+ (or your project's supported version)
- npm or yarn
- MySQL server (local or remote)
- Git
- Optional: Docker & Docker Compose

---

## Local setup

### Clone

```bash
git clone https://github.com/karan-7058/Store-Rating-App.git
cd Store-Rating-App
```


### Database setup (MySQL)

1. Create the database:

```sql
CREATE DATABASE store_rating CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Create a user and grant privileges (optional):

```sql
CREATE USER 'store_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON store_rating.* TO 'store_user'@'%';
FLUSH PRIVILEGES;
```

3. Use one of these approaches to create tables:

A) Raw SQL (quick):

Run the SQL in [Database schema (example SQL) section](#database-schema-example-s

### Run server (Express)

From project root or `server/`:

```bash
cd server
npm install
cp .env.example .env   # fill values
npm run dev            # recommended: uses nodemon
# or
npm start              # production start
```

Common server scripts (add to `server/package.json` if missing):
- `start` — production start (node index.js)
- `dev` — development with nodemon
- `test` — run server tests

Server listens on `PORT` and exposes API routes under `/api` (see API overview).

### Run client (React)

From project root or `client/`:

```bash
cd client
npm install
cp .env.example .env   # fill REACT_APP_API_URL
npm start
```

Client runs on `http://localhost:3000` by default and calls backend API.

 

## API overview (example endpoints)

These are example REST endpoints — adapt to your implementation.

Auth
- POST /api/auth/register — register user (body: name, email, password)
- POST /api/auth/login — login (body: email, password) -> returns JWT

Stores
- GET /api/stores — list stores (query: page, limit, q, category)
- POST /api/stores — create store (admin) (body: name, description, category, address, images[])
- GET /api/stores/:id — get store details (includes average rating)
- PUT /api/stores/:id — update store (admin)
- DELETE /api/stores/:id — delete store (admin)

Ratings / Reviews
- POST /api/stores/:id/ratings — add rating (auth required) (body: score, comment)
- GET /api/stores/:id/ratings — list ratings for a store
- DELETE /api/stores/:id/ratings/:ratingId — delete rating (owner/admin)

---

## Contributing

- Fork the repo
- Create a feature branch
- Commit and push
- Open a PR with description and testing steps


