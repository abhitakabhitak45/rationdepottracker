const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema(
  {
    cardNumber: { type: String, required: true, unique: true, trim: true },
    headName: { type: String, required: true, trim: true },
    village: { type: String, required: true, trim: true },
    members: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
