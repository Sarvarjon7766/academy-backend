// studentpayment.model.js
const { Schema, model } = require('mongoose');

const studentPaymentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'student', required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  amount_due: { type: Number, required: true },
  amount_paid: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  details: [{
    type: { type: String, enum: ['subject', 'hostel', 'transport', 'product'], required: true },
    label: { type: String, required: true },
    amount: { type: Number, required: true },
    comment: { type: String }
  }]
}, { timestamps: true });

module.exports = model('studentpayment', studentPaymentSchema);
