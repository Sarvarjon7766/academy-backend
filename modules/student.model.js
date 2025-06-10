const { model, Schema } = require('mongoose')

const studentSchema = new Schema({
	fullName: {
		type: String,
		required: true
	},
	date_of_birth: {
		type: Date,
		required: true
	},
	gender: {
		type: String,
		enum: ['erkak', 'ayol'],
		required: true
	},
	address: {
		type: String,
		required: true
	},
	old_school: {
		type: String,
		required: true
	},
	old_class: {
		type: String,
		required: true
	},
	photo: {
		type: String,
		required: false
	},
	phone: {
		type: String,
		required: false
	},

	login: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},

	status: {
		type: String,
		enum: ['active', 'archived', 'removed'],
		default: 'active'
	},

	main_subjects: [{
		subjectId: { type: Schema.Types.ObjectId, ref: 'subject', required: true },
		price: { type: Number, default: 0 },
		groupId: { type: Schema.Types.ObjectId, ref: 'group' },
		teacherId: { type: Schema.Types.ObjectId, ref: 'teacher' }
	}],

	additionalSubjects: [{
		subjectId: { type: Schema.Types.ObjectId, ref: 'subject', required: true },
		price: { type: Number, default: 0 },
		groupId: { type: Schema.Types.ObjectId, ref: 'group' },
		teacherId: { type: Schema.Types.ObjectId, ref: 'teacher' }
	}],

	main_subject_history: [{
		subjectId: { type: Schema.Types.ObjectId, ref: 'subject' },
		price: { type: Number, default: 0 },
		groupId: { type: Schema.Types.ObjectId, ref: 'group' },
		teacherId: { type: Schema.Types.ObjectId, ref: 'teacher' },
		fromDate: { type: Date, required: true },
		toDate: { type: Date }
	}],

	additional_subject_history: [{
		subjectId: { type: Schema.Types.ObjectId, ref: 'subject' },
		price: { type: Number, default: 0 },
		groupId: { type: Schema.Types.ObjectId, ref: 'group' },
		teacherId: { type: Schema.Types.ObjectId, ref: 'teacher' },
		fromDate: { type: Date, required: true },
		toDate: { type: Date }
	}],

	groups: [{
		group: { type: Schema.Types.ObjectId, ref: 'group' },
		type: { type: String, enum: ['main', 'additional'] },
		teacherId: { type: Schema.Types.ObjectId, ref: 'teacher' },
	}],

	hostel: {
		type: Schema.Types.ObjectId,
		ref: 'hostel',
		required: false
	},
	hostel_history: [{
		hostelId:{type:Schema.Types.ObjectId,ref:'hostel'},
		price: { type: Number, default: 0 },
		fromDate: { type: Date, required: true },
		toDate: { type: Date }
	}],

	product: {
		type: Schema.Types.ObjectId,
		ref: 'product',
		required: false
	},
	product_history: [{
		productId:{type:Schema.Types.ObjectId,ref:'product'},
		price: { type: Number, default: 0 },
		fromDate: { type: Date, required: true },
		toDate: { type: Date }
	}],

	transport: {
		type: Schema.Types.ObjectId,
		ref: 'transport',
		required: false
	},
	transport_history: [{
		transportId:{type:Schema.Types.ObjectId,ref:'transport'},
		price: { type: Number, default: 0 },
		fromDate: { type: Date, required: true },
		toDate: { type: Date }
	}],

	sunday: {
		type: Boolean,
		default: false
	},

	monthly_payment: {
		type: Number,
		required: false
	},

	role: {
		type: Number,
		default: 2
	}
}, {
	timestamps: true
})

module.exports = model('student', studentSchema)
