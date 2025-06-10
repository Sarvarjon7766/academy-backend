const { model, Schema } = require('mongoose');

const hostelSchema = new Schema({
  hostelName: {
    type: String,
    required: true,
  },
  hostelPrice: {
    type: Number,
    required: true,
  },
  enrollment_date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = model('hostel', hostelSchema); 