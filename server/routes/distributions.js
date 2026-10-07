const express = require('express');
const Joi = require('joi');
const Beneficiary = require('../models/Beneficiary');
const StockItem = require('../models/StockItem');
const Distribution = require('../models/Distribution');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');

const router = express.Router();

const createSchema = Joi.object({
  beneficiaryId: Joi.string().hex().length(24).required(),
  itemId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().greater(0).required(),
  authMethod: Joi.string().valid('biometric', 'otp').required(),
});

const POPULATE = 'cardNumber headName village';

function newReceiptNumber() {
  return `RCP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const list = await Distribution.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('beneficiary', POPULATE);
    res.json(list);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const dist = await Distribution.findById(req.params.id).populate('beneficiary', POPULATE);
    if (!dist) return res.status(404).json({ error: 'Receipt not found' });
    res.json(dist);
  })
);

router.post(
  '/',
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const { beneficiaryId, itemId, quantity, authMethod } = req.body;

    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });

    // Atomic check-and-reduce: only succeeds if enough stock is left,
    // so two simultaneous requests can never push stock below zero.
    const item = await StockItem.findOneAndUpdate(
      { _id: itemId, quantity: { $gte: quantity } },
      { $inc: { quantity: -quantity } },
      { new: true }
    );
    if (!item) {
      const exists = await StockItem.exists({ _id: itemId });
      return res
        .status(exists ? 400 : 404)
        .json({ error: exists ? 'Not enough stock for this distribution' : 'Stock item not found' });
    }

    try {
      const dist = await Distribution.create({
        receiptNumber: newReceiptNumber(),
        beneficiary: beneficiary._id,
        item: item._id,
        itemName: item.name,
        unit: item.unit,
        quantity,
        authMethod,
      });
      await dist.populate('beneficiary', POPULATE);
      res.status(201).json(dist);
    } catch (err) {
      // Saving the receipt failed, so put the stock back before reporting the error
      await StockItem.updateOne({ _id: item._id }, { $inc: { quantity } });
      throw err;
    }
  })
);

module.exports = router;
