const { model, Schema, now } = require('mongoose')

const teacherAttendanceSchema = new Schema({
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'teacher',
    required: true
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'subject',
    required: true
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'group',
    required: true
  },
  date: {
    type: Date,
    default: now
  }
}, {
  timestamps: true // avtomatik createdAt va updatedAt qo‘shadi
})

module.exports = model('teacherattendance', teacherAttendanceSchema)
