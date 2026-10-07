const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, required: true, unique: true },
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary', required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'StockItem', required: true },
    // Snapshot of the item at the time of distribution, so old receipts never change
    itemName: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0.01 },
    authMethod: { type: String, required: true, enum: ['biometric', 'otp'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Distribution', distributionSchema);
