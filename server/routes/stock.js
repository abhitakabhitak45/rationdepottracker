const express = require('express');
const Joi = require('joi');
const StockItem = require('../models/StockItem');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');

const router = express.Router();

const createSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
  unit: Joi.string().valid('kg', 'kit').required(),
  quantity: Joi.number().min(0).required(),
});

const addSchema = Joi.object({
  quantity: Joi.number().greater(0).required(),
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await StockItem.find().sort({ name: 1 }));
  })
);

router.post(
  '/',
  validate(createSchema),
  asyncHandler(async (req, res) => {
    res.status(201).json(await StockItem.create(req.body));
  })
);

// POST /api/stock/:id/add  { quantity }  -> stock received from the warehouse
router.post(
  '/:id/add',
  validate(addSchema),
  asyncHandler(async (req, res) => {
    const item = await StockItem.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: req.body.quantity } },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Stock item not found' });
    res.json(item);
  })
);

module.exports = router;
