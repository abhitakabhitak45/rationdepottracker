# Ration Depot Tracker

A full-stack MERN demo app for a ration depot: register ration cards, track stock, issue
distributions with a printable receipt, and see a monthly summary.

**Demo data only.** Never enter real beneficiary names, card numbers or Aadhaar details.

## Features
- Beneficiaries: add, search (name / card / village), remove
- Stock: add items, receive new stock, low-stock warning on the dashboard
- Distribution: pick a card and item, record biometric or OTP authentication, issue a receipt
- Stock can never go below zero (atomic MongoDB update, restored if saving the receipt fails)
- Printable receipt, distribution history, monthly summary (MongoDB aggregation)
- Input validation with Joi and one global error handler

## Tech
React (Vite) · Node.js · Express · MongoDB (Mongoose) · Joi

## Run locally
You need Node.js 18+ and a free MongoDB Atlas cluster.

```bash
# 1. API
cd server
npm install
cp .env.example .env        # add your MONGODB_URI
npm run seed                # optional: loads fake demo data
npm run dev                 # http://localhost:5000

# 2. Web app (new terminal)
cd client
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

## Deploy (free tiers)
1. **Database:** MongoDB Atlas free cluster. Allow network access (0.0.0.0/0 for a demo).
2. **API:** Render "Web Service" from the `server` folder. Build `npm install`, start `npm start`.
   Set `MONGODB_URI` and `CLIENT_ORIGIN` (your Vercel URL).
3. **Web app:** Vercel from the `client` folder. Set `VITE_API_URL` to your Render URL.
4. Open the live URL, run the seed once, and add both links to your resume.

## API
| Method | Route | Purpose |
|---|---|---|
| GET/POST | /api/beneficiaries | List (supports `?q=`) / create |
| DELETE | /api/beneficiaries/:id | Remove a card |
| GET/POST | /api/stock | List / create item |
| POST | /api/stock/:id/add | Receive stock |
| GET/POST | /api/distributions | History / issue a receipt |
| GET | /api/distributions/:id | One receipt |
| GET | /api/summary | Dashboard numbers |

