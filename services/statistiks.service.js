const attandanceModel = require('../modules/attandance.model')
const employerModel = require('../modules/employer.model')
const groupModel = require('../modules/group.model')
const studentModel = require('../modules/student.model')
const subjectModel = require('../modules/subject.model')
const teacherModel = require('../modules/teacher.model')





class StatistiksService {
	async getStatistiks(data) {
		try {
			const student = await studentModel.find({ status: 'active' })
			const teacher = await teacherModel.find({ isAdmin: false })
			const subject = await subjectModel.find()
			const employer = await employerModel.find({ status: 'active' })
			return { success: true, student: student.length, teacher: teacher.length, employer: employer.length, subject: subject.length, message: "Statistika ma'lumotlari" }


		} catch (error) {
			console.error("Xatolik:", error)
			return { success: false, message: "Ichki xatolik yuz berdi", studentId: null }
		}
	}
	async PaymentStatistiksMonth(data) {
		try {
			const { year, month } = data
			console.log(year)
			console.log(month)
			const students = await studentModel.find()
			console.log()
		} catch (error) {
			console.error("Xatolik:", error)
			return { success: false, message: "Ichki xatolik yuz berdi", studentId: null }
		}
	}
	async TeacherStatistiks(data) {
		try {
			const { year, month } = data
			const currentyear = Number(year)
			const currentmonth = Number(month)

			// Date oralig'i
			const startDate = new Date(currentyear, currentmonth - 1, 1)
			const endDate = new Date(currentyear, currentmonth, 1)

			// Baza so'rovlari
			const teachers = await teacherModel.find()
			const groups = await groupModel.find()
			const attendance = await attandanceModel.find({
				date: { $gte: startDate, $lt: endDate }
			})

			const result = []

			for (const teacher of teachers) {
				const teacherSubjectIds = teacher.subjects.map(id => id.toString())

				// Teacherning subjectlariga tegishli guruhlar
				const teacherGroups = groups.filter(group =>
					group.subject && teacherSubjectIds.includes(group.subject.toString())
				)

				const teacherStats = []

				for (const group of teacherGroups) {
					const groupId = group._id.toString()
					const studentIds = group.students.map(id => id.toString())

					for (const studentId of studentIds) {
						// Umumiy darslar soni (bu yerda har kungi 1 dars deb olamiz)
						const totalLessons = await attandanceModel.countDocuments({
							groupId,
							studentId,
							date: { $gte: startDate, $lt: endDate }
						})

						const attendedLessons = attendance.filter(a =>
							a.groupId?.toString() === groupId &&
							a.studentId?.toString() === studentId &&
							a.Status === 'Kelgan'
						).length

						teacherStats.push({
							studentId,
							groupId,
							subjectId: group.subject, // << Qo‘shilgan qism
							totalLessons,
							attendedLessons
						})
					}
				}

				result.push({
					teacherId: teacher._id,
					teacherStats
				})
			}
			// console.log(result[1].teacherStats)

			return {
				success: true,
				data: result
			}

		} catch (error) {
			console.error("Xatolik:", error)
			return {
				success: false,
				message: "Ichki xatolik yuz berdi"
			}
		}
	}
	async InMonth(user) {
  try {
    const teacherId = user.id;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based index

    // 1. Ustozga tegishli guruhlar
    const groups = await groupModel.find({ teacher: teacherId });
    const groupIds = groups.map(group => group._id);

    // 2. Hozirgi oydagi barcha qatnashuvlar
    const attendances = await attandanceModel.find({
      groupId: { $in: groupIds },
      date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1)
      }
    });

    // 3. Talaba IDlarini yig'ish
    let allStudentIds = [];
    groups.forEach(group => {
      if (Array.isArray(group.students)) {
        allStudentIds = allStudentIds.concat(group.students);
      }
    });
    const uniqueStudentIds = [...new Set(allStudentIds.map(id => id.toString()))];

    // 4. Umumiy o'rtacha baho va qatnashish foizi hisoblash
    const studentScores = {};
    const studentAttended = {};
    const studentTotal = {};

    attendances.forEach(att => {
      const sid = att.studentId.toString();
      studentScores[sid] = (studentScores[sid] || 0) + (att.score || 0);
      studentTotal[sid] = (studentTotal[sid] || 0) + 1;
      if (att.status === "Kelgan") {
        studentAttended[sid] = (studentAttended[sid] || 0) + 1;
      }
    });

    const studentCount = Object.keys(studentScores).length;

    const totalAvgScore =
      studentCount > 0
        ? Object.values(studentScores).reduce((a, b) => a + b, 0) / studentCount
        : 0;

    const totalAvgAttendance =
      studentCount > 0
        ? Object.keys(studentTotal).reduce((acc, sid) => {
            const attended = studentAttended[sid] || 0;
            const total = studentTotal[sid] || 1;
            return acc + (attended / total) * 100;
          }, 0) / studentCount
        : 0;

    // 5. Fanlar soni
    const teacher = await teacherModel.findById(teacherId);
    const subjectCount = teacher?.subjects?.length || 0;

    // 6. Yakuniy natija
    return {
      success: true,
      groups: groups.length,
      students: uniqueStudentIds.length,
      subjects: subjectCount,
      score: totalAvgScore.toFixed(1),
      attandances: totalAvgAttendance.toFixed(1)
    };

  } catch (error) {
    console.error("Xatolik:", error);
    return {
      success: false,
      message: "Ichki xatolik yuz berdi"
    };
  }
}



}

module.exports = new StatistiksService()