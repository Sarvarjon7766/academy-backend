const { model, Schema } = require('mongoose');

const paymentSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'student',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  subjects: [{
    subjectId: { type: Schema.Types.ObjectId, ref: 'subject', required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date }, // null bo‘lsa hali davom etmoqda
    dailyRate: { type: Number, required: true },
    totalDays: { type: Number, required: true },
    amountDue: { type: Number, required: true }
  }],
  amountPaid: {
    type: Number,
    required: true,
    default: 0
  },
  amountDue: {
    type: Number,
    required: true
  },
  balanceAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ["To'langan", "To'lanmoqda", "To'lanmagan"],
    default: "To'lanmagan"
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  daysAttended: {
    type: Number,
    required: true,
    default: 0
  },
  totalDaysinMonth: {
    type: Number,
    required: true,
    default: 0
  },
  refundableAmount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = model('payment', paymentSchema);
