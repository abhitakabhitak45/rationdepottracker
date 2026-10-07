const express = require('express');
const Joi = require('joi');
const Beneficiary = require('../models/Beneficiary');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');

const router = express.Router();

const createSchema = Joi.object({
  cardNumber: Joi.string().trim().min(3).max(30).required(),
  headName: Joi.string().trim().min(2).max(80).required(),
  village: Joi.string().trim().min(2).max(60).required(),
  members: Joi.number().integer().min(1).max(30).required(),
});

// GET /api/beneficiaries?q=search-text
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.q) {
      const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ headName: rx }, { cardNumber: rx }, { village: rx }];
    }
    const list = await Beneficiary.find(filter).sort({ village: 1, headName: 1 });
    res.json(list);
  })
);

router.post(
  '/',
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const created = await Beneficiary.create(req.body);
    res.status(201).json(created);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const removed = await Beneficiary.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Beneficiary not found' });
    res.json({ ok: true });
  })
);

module.exports = router;
