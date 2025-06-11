const {model,Schema} = require('mongoose')

const groupSchema = new Schema({
  groupName: { type: String, required: true },
  subject: { type: Schema.Types.ObjectId, ref: "subject", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "teacher", required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "student" }]
});

module.exports = model("group", groupSchema);
