# Ration Depot Tracker

A full-stack MERN app for managing a ration depot: beneficiaries, stock, distributions and receipts, with a monthly dashboard summary.

> **Demo project.** All data in the seed script is made-up sample data. No real beneficiary information is used.

## Screenshot

![Dashboard](./screenshots/dashboard.png)

*(Add a screenshot of the dashboard at `screenshots/dashboard.png`.)*

## Features

- Dashboard with a monthly summary: ration cards registered, distributions this month, items distributed
- Stock in hand, tracked per item (for example wheat, atta, food-grain kits)
- Beneficiary (ration card) records
- Distribution records tied to beneficiaries and stock
- Request validation, centralised error handling and an API health check

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React, Vite                         |
| Backend  | Node.js, Express                    |
| Database | MongoDB Atlas, Mongoose             |

## Project Structure

```
ration-depot-tracker/
├── client/          # React app (Vite)
└── server/
    ├── middleware/  # asyncHandler, errorHandler, validate
    ├── models/      # Beneficiary, Distribution, StockItem
    ├── routes/      # beneficiaries, distributions, stock, summary
    ├── seed.js      # loads demo data
    └── server.js    # Express entry point
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A MongoDB database, either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB install

### 1. Clone the repo

```bash
git clone https://github.com/abhitakabhitak45/rationdepottracker.git
cd rationdepottracker
```

### 2. Set up the server

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in your own values:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ration-depot-tracker
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

For local MongoDB, use `MONGODB_URI=mongodb://127.0.0.1:27017/ration-depot-tracker`.

Load the demo data once, then start the API:

```bash
node seed.js
npm run dev
```

The API runs on `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

### 3. Set up the client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## Notes

- Never commit your `.env` file. It is listed in `.gitignore`.
- If you use Atlas, add your IP address under **Network Access** and URL-encode any special characters in your database password.

## Author

**Abhishek** | [GitHub](https://github.com/abhitakabhitak45)
