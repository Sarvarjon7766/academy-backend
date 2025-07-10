const { model, Schema } = require('mongoose');

const studentPaymentTransactionSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'student',
    required: true
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'studentpayment', // umumiy oylik hisob-kitobga bog‘lanadi
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: false
  },
  paidAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = model('studentpaymenttransaction', studentPaymentTransactionSchema);
