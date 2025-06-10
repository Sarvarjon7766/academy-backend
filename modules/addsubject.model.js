const { model, Schema } = require('mongoose');

const addSubjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
  },
  subjectPrice: {
    type: Number,
    required: true,
  },
  sent_date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = model('addSubject', addSubjectSchema); 