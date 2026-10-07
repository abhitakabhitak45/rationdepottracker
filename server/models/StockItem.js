const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    unit: { type: String, required: true, enum: ['kg', 'kit'] },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockItem', stockItemSchema);
