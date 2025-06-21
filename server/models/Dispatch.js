const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  supplier: { type: String, required: true },
  vehicle: { type: String, required: true },
  weight: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Dispatch', dispatchSchema); 