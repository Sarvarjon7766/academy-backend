const { model, Schema } = require('mongoose')

const roomsSchema = new Schema({
	roomNumber: {
		type: String,
		required: true
	},
	roomCapacity: {
		type: Number,
		required: true
	},
	beds: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Student',
			default: null
		}
	]
})

module.exports = new model('rooms',roomsSchema)