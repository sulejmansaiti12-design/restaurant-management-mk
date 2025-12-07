# Restaurant Management System - North Macedonia

## Complete Production-Ready POS System with Macedonian Fiscal Compliance

### Features

✅ **Authentication & Authorization**
- JWT-based authentication (7-day token expiry)
- 5 user roles: owner, admin, waiter, developer, customer
- Waiter PIN login (4-6 digit)
- Customer QR code/table-based login
- Role-based access control (RBAC)

✅ **Order Management**
- Complete order lifecycle: pending → paid
- Macedonian VAT calculation (18%, 10%, 5%, 0%)
- Cash/Card/Mixed payments
- Fiscal receipt generation
- Order history and search

✅ **Shift Management**
- Waiter shift tracking
- Revenue attribution
- Clock in/out
- Performance metrics

✅ **Financial Management**
- Cash drawer operations
- Reconciliation
- Daily closing reports
- Tax breakdown

✅ **Customer Experience**
- QR code menu access
- Mobile ordering
- Rating system (1-5 stars)
- Call waiter / Request bill

✅ **Macedonian Fiscal Compliance**
- Dynamic per-item VAT rates
- Fiscal number generation: `FIS-YYYYMMDD-NNNNN`
- Tax reports
- UPS integration ready

✅ **Real-Time Updates**
- Server-Sent Events (SSE)
- Kitchen/bar notifications
- Auto-reconnect

---

## Tech Stack

### Backend
- Node.js 16+ / Express.js
- PostgreSQL 12+ / Sequelize ORM
- JWT authentication / bcrypt
- Server-Sent Events (SSE)

### Frontend
- Flutter (Dart)
- Dio HTTP client
- Provider state management
- Material Design 3

---

## Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Flutter SDK 3.0+

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run init:db
npm run seed
npm run setup:fiscal
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
flutter pub get
flutter run
```

---

## API Documentation

**Base URL:** `http://localhost:5000/api`

### Authentication
```
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

### Orders (18 endpoints)
```
POST /orders
GET  /orders
GET  /orders/:id
POST /orders/:id/payment
...
```

See `docs/API.md` for complete endpoint list.

---

## Database Schema

28 models including:
- User, Waiter, Customer
- Order, OrderItem, Payment
- Shift, ClockRecord
- MenuItem, Category
- Rating, Performance
- FiscalReceipt, TaxConfig
- CashDrawer, ClosingReport

---

## Default Credentials

**Owner:**
- Username: `owner`
- Password: `owner123`

**Admin:**
- Username: `admin`
- Password: `admin123`

**Developer:**
- Username: `developer`
- Password: `dev123`

**Waiters:**
- PIN: `1001`, `1002`, `1003`

---

## License

MIT License

---

## Support

For issues and questions, please create a GitHub issue.
