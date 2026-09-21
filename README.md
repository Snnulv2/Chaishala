# 🍵 Chaishala — Full-Stack Premium Tea Shop

A complete full-stack tea e-commerce application with React frontend, Node.js/Express backend, and MariaDB database.

## Features

- 🛒 Tea catalog with categories, search, and filters
- 🎠 Beautiful slideshow showcasing tea varieties
- 🛍️ Shopping cart with quantity management
- 💳 Checkout with Card / UPI / Net Banking payment
- 🧾 Auto-generated downloadable PDF invoice
- 👤 User registration & login (JWT auth)
- 📦 Order history for customers
- 🔧 Full admin panel (dashboard, orders, products, users)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Swiper, jsPDF |
| Backend | Node.js, Express.js |
| Database | MariaDB (via mysql2) |
| Auth | JWT + bcryptjs |

## Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@chaishala.com` |
| Password | `Chaishala@123` |

---

## Setup Instructions

### 1. Prerequisites

- [Node.js](https://nodejs.org) v18+
- [MariaDB](https://mariadb.org) or MySQL 8+

### 2. Database Setup

Open MariaDB and run:

```sql
source d:/chaishala/database/schema.sql
```

This creates the `chaishala_db` database with all tables and seed data (12 tea products + categories).

### 3. Backend Setup

```bash
cd d:\chaishala\backend

# Copy environment file
copy .env.example .env
```

Edit `backend\.env` — update your MariaDB password:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MARIADB_PASSWORD_HERE
DB_NAME=chaishala_db
JWT_SECRET=chaishala_super_secret_jwt_key_2024
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Then seed the admin user:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev      # Development (with nodemon)
# or
npm start        # Production
```

Backend runs on: **http://localhost:5000**

### 4. Frontend Setup

```bash
cd d:\chaishala\frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## Project Structure

```
chaishala/
├── database/
│   ├── schema.sql          # Database schema + seed data
│   └── seed.js             # Admin user seeder
├── backend/
│   ├── config/db.js        # MariaDB connection pool
│   ├── controllers/        # Business logic
│   ├── middleware/auth.js  # JWT middleware
│   ├── routes/             # API routes
│   ├── .env.example        # Environment template
│   └── server.js           # Express entry point
└── frontend/
    ├── src/
    │   ├── components/     # Navbar, Footer, TeaCard, Slideshow
    │   ├── context/        # Auth + Cart context
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Menu.jsx
    │       ├── Cart.jsx
    │       ├── Checkout.jsx
    │       ├── InvoicePage.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── MyOrders.jsx
    │       └── admin/      # Admin panel
    └── vite.config.js
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/teas` | List all teas |
| GET | `/api/teas/categories` | Tea categories |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my-orders` | User's orders (auth) |
| GET | `/api/orders/:id` | Order details |
| GET | `/api/admin/dashboard` | Admin stats (admin) |
| GET | `/api/admin/orders` | All orders (admin) |
| GET | `/api/admin/users` | All users (admin) |
| POST | `/api/teas` | Add tea (admin) |
| PUT | `/api/teas/:id` | Update tea (admin) |
| DELETE | `/api/teas/:id` | Remove tea (admin) |

## User Flow

1. Visit **http://localhost:5173**
2. Browse teas on the Menu page
3. Add teas to cart
4. Proceed to Checkout — enter delivery info + payment
5. Click **Pay** → order is confirmed → invoice auto-generated
6. Download PDF invoice

## Admin Flow

1. Login with `admin@chaishala.com` / `Chaishala@123`
2. Auto-redirected to `/admin` dashboard
3. Manage orders, update statuses, manage tea catalog, view users
