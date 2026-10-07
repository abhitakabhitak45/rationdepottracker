const express = require('express');
const Beneficiary = require('../models/Beneficiary');
const StockItem = require('../models/StockItem');
const Distribution = require('../models/Distribution');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// GET /api/summary -> numbers for the dashboard (current month)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [beneficiaries, distributionsThisMonth, byItem, stock] = await Promise.all([
      Beneficiary.countDocuments(),
      Distribution.countDocuments({ createdAt: { $gte: monthStart } }),
      Distribution.aggregate([
        { $match: { createdAt: { $gte: monthStart } } },
        {
          $group: {
            _id: { name: '$itemName', unit: '$unit' },
            total: { $sum: '$quantity' },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, name: '$_id.name', unit: '$_id.unit', total: 1, count: 1 } },
        { $sort: { name: 1 } },
      ]),
      StockItem.find().sort({ name: 1 }),
    ]);

    res.json({
      month: monthStart.toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      beneficiaries,
      distributionsThisMonth,
      byItem,
      stock,
    });
  })
);

module.exports = router;
