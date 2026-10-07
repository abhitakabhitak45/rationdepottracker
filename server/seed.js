// Fills the database with FAKE demo data. Never put real beneficiary details here.
require('dotenv').config();
const mongoose = require('mongoose');
const Beneficiary = require('./models/Beneficiary');
const StockItem = require('./models/StockItem');
const Distribution = require('./models/Distribution');

const villages = ['Village A', 'Village B', 'Village C', 'Village D', 'Village E'];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([Beneficiary.deleteMany(), StockItem.deleteMany(), Distribution.deleteMany()]);

  const beneficiaries = Array.from({ length: 15 }, (_, i) => ({
    cardNumber: `DEMO-${String(i + 1).padStart(4, '0')}`,
    headName: `Demo Beneficiary ${i + 1}`,
    village: villages[i % villages.length],
    members: (i % 5) + 2,
  }));
  await Beneficiary.insertMany(beneficiaries);

  await StockItem.insertMany([
    { name: 'Wheat', unit: 'kg', quantity: 5000 },
    { name: 'Atta', unit: 'kg', quantity: 800 },
    { name: 'Food-grain kit', unit: 'kit', quantity: 200 },
  ]);

  console.log('Seeded 15 demo beneficiaries and 3 stock items.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
