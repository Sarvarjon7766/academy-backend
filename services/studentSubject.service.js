const { default: mongoose } = require('mongoose')
const studentSubjectModel = require('../modules/studentSubject.model')

class StudentSubjectService{
	async studentSubject(studentId,subjects){
		try {
			const Subjects = []
			if(studentId && subjects){
				if(subjects.MainSubjectId1){
					Subjects.push({
						studentId:new mongoose.Types.ObjectId(studentId),
						subjectId:new mongoose.Types.ObjectId(subjects.MainSubjectId1),
						subject_price:subjects.MainSubject1Payment,
						subject_type:true
					})
				}
			}
			if(subjects.MainSubjectId2){
				Subjects.push({
					studentId:new mongoose.Types.ObjectId(studentId),
					subjectId:new mongoose.Types.ObjectId(subjects.MainSubjectId2),
					subject_price:subjects.MainSubject2Payment,
					subject_type:true
				})
			}
			if (subjects.AdditionalSubjectId1) {
				Subjects.push({
					studentId: new mongoose.Types.ObjectId(studentId),
					subjectId: new mongoose.Types.ObjectId(subjects.AdditionalSubjectId1),
					subject_price: subjects.AdditionalSubject1Payment,
					subject_type: false,
				});
			}
			if (subjects.AdditionalSubjectId2) {
				Subjects.push({
					studentId: new mongoose.Types.ObjectId(studentId),
					subjectId: new mongoose.Types.ObjectId(subjects.AdditionalSubjectId2),
					subject_price: subjects.AdditionalSubject2Payment,
					subject_type: false,
				});
			}
			if (subjects.AdditionalSubjectId3) {
				Subjects.push({
					studentId: new mongoose.Types.ObjectId(studentId),
					subjectId: new mongoose.Types.ObjectId(subjects.AdditionalSubjectId3),
					subject_price: subjects.AdditionalSubject3Payment,
					subject_type: false,
				});
			}
			const newSubject = await studentSubjectModel.insertMany(Subjects)
			return newSubject


		} catch (error) {
			
		}

	}
	async create(studentId,SubjectId){
		
	}
}

module.exports = new StudentSubjectService()