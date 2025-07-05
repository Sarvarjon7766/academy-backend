const mongoose = require('mongoose')
const { Schema, model } = mongoose

const paymentSchema = new Schema({
  teacherId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Teacher'
  },
  amount: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  avansUsed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('teacherPayment', paymentSchema)
