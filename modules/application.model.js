const { model, Schema } = require('mongoose');

const applicationSchema = new Schema({
	fullName: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	isActive: {
		type: Boolean,
		default: false
	},
	sent_date: {
		type: Date,
		default: Date.now 
	}
}); 

module.exports = model('Application', applicationSchema);
