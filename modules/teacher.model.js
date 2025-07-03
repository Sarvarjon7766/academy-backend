const { model, Schema } = require('mongoose');

const teacherSchema = new Schema({
	fullName: {
		type: String,
		required: true
	},
	date_of_birth: {
		type: Date
	},
	gender: {
		type: String,
		enum: ['erkak', 'Ayol']
	},
	address: {
		type: String
	},
	qualification: {
		type: String
	},
	photo: {
		type: String
	},
	phone: {
		type: String
	},
	subjects: [
		{
			type: Schema.Types.ObjectId,
			ref: "subject"
		}
	],
	login: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		default: "1"
	},
	isAdmin: {
		type: Boolean,
		default: false
	},

	// Eskisi (endi ishlatilmaydi, faqat backward compatibility uchun qoldirilgan)
	salary: {
		type: Number,
		default: 0
	},
	share_of_salary: {
		type: Number,
		default: 0
	},

	// ✅ YANGI: Versiyalash uchun tarixiy ma’lumotlar
	salaryHistory: [
		{
			from: {
				type: Date,
				required: true
			},
			salary: {
				type: Number,
				required: true
			},
			share_of_salary: {
				type: Number,
				required: true
			}
		}
	]
});

module.exports = new model('teacher', teacherSchema);
