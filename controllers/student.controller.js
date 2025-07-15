const { json } = require('body-parser')
const studentService = require('../services/student.service')


class StudentController {
	async create(req, res) {
		try {
			const newStudent = await studentService.create(req.body)
			if (newStudent && newStudent.success) {
				return res.status(201).json({ message: "Student yaratildi", success: true })
			}
			return res.status(500).json({ message: newStudent.message, success: false })
		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async createPersonal(req, res) {
		try {
			console.log(req.body)
			const newStudent = await studentService.createPersonal(req.body)
			if (newStudent && newStudent.success) {
				return res.status(201).json({ message: "Student yaratildi", success: true, studentId: newStudent.studentId })
			}
			return res.status(500).json({ message: newStudent.message, success: false, studentId: newStudent.studentId })
		} catch (error) {
			return res.status(500).json({ message: error, success: false, studentId: null })
		}
	}
	async updatePersonal(req, res) {
		try {
			console.log(req.body)
			const newStudent = await studentService.updatePersonal(req.params,req.body)
			if (newStudent && newStudent.success) {
				return res.status(200).json({ message: "Student yangilandi", success: true, student: newStudent.student })
			}
			return res.status(500).json({ message: newStudent.message, success: false, studentId: newStudent.studentId })
		} catch (error) {
			return res.status(500).json({ message: error, success: false, studentId: null })
		}
	}
	async addMainSubjects(req, res) {
		try {
			const data = await studentService.addMainSubjects(req.params.studentId, req.body)
			if (data.success) {
				return res.status(200).json({ success: true, permission: 2 })
			}
			return res.status(400).json({ success: false, permission: 1 })

		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async updateMainSubjects(req, res) {
		try {
			const data = await studentService.updateMainSubjects(req.params.studentId, req.body)
			if (data.success) {
				return res.status(200).json({ success: true, permission: 2 })
			}
			return res.status(400).json({ success: false, permission: 1 })

		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async MainSubject(req, res) {
		try {
			const data = await studentService.MainSubject(req.params.studentId)
			if (data.success) {
				console.log(data)
				return res.status(200).json(data)
			}
			return res.status(400).json({ success: false, data })

		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async MainHistory(req, res) {
		try {
			const data = await studentService.MainHistory(req.params.studentId)
			if (data.success) {
				console.log(data)
				return res.status(200).json(data)
			}
			return res.status(400).json({ success: false, data })

		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async addAdditionalSub(req, res) {
		try {
			console.log(req.params)
			console.log(req.body.subjects)
			const data = await studentService.addAdditionalSub(req.params, req.body)
			console.log(data)
			if (data.success) {
				return res.status(200).json({ success: true, permission: 3 })
			} else {
				return res.status(400).json({ success: false, permission: 2 })
			}
		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async UpdateAdditionalSub(req, res) {
		try {
			console.log(req.params)
			console.log(req.body.subjects)
			const data = await studentService.UpdateAdditionalSub(req.params, req.body)
			console.log(data)
			if (data.success) {
				return res.status(200).json(data)
			} else {
				return res.status(400).json({ success: false, permission: 2 })
			}
		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async AdditionalSubject(req, res) {
		try {
			console.log(req.params)
			const data = await studentService.AdditionalSubject(req.params.studentId)
			console.log(data)
			if (data.success) {
				return res.status(200).json({ success: true, additionalSub: data.data })
			} else {
				return res.status(400).json({ success: false, additionalSub: [] })
			}
		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async AddMonthlyPayment(req, res) {
		try {
			const data = await studentService.AddMonthlyPayment(req.params, req.body.xizmatlar)
			if (data.success) {
				return res.status(200).json(data)
			}
			return res.status(400).json({ success: false, permission: 3 })
		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async updateOtherCost(req, res) {
		try {
			const data = await studentService.updateOtherCost(req.params, req.body.xizmatlar)
			if (data.success) {
				return res.status(200).json(data)
			}
			return res.status(400).json({ success: false, permission: 3 })
		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}


	async studentSubjects(req, res) {
		try {
			const data = await studentService.studentSubjects(req.params)
			if (data.success) {
				return res.status(200).json({ success: true, data })
			}
			return res.status(400).json({ success: false, data: [] })
		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
	async getSunday(req, res) {
		try {
			const data = await studentService.getSunday()

			if (data?.success) {
				return res.status(200).json(data)
			}

			return res.status(400).json({
				success: false,
				message: data?.message || "Ma'lumot topilmadi yoki noaniq xatolik yuz berdi"
			})

		} catch (error) {
			console.error("getSunday Error:", error)
			return res.status(500).json({
				success: false,
				message: "Ichki server xatoligi",
				error: error?.message || error
			})
		}
	}



	async login(req, res) {
		try {
			const { login, password } = req.body
			const student = await studentService.login(login, password)
			console.log(student)
			if (student == 'Foydalanuvchi topilmadi') {
				res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" })
			} else if (student == 'parol xato') {
				res.status(404).json({ success: false, message: 'parol xato' })
			} else
				res.status(200).json({ success: true, token: student.token })
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
	async getAll(req, res) {
		try {
			const student = await studentService.getAll()
			if (student.success) {
				res.status(200).json({ success: true, students: student.exsistStudents })
			} else {
				res.status(404).json({ success: false, message: student.message })
			}
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
	async getAllfull(req, res) {
		try {
			const student = await studentService.getAllfull()
			if (student.success) {
				res.status(200).json({ success: true, students: student.exsistStudents })
			} else {
				res.status(404).json({ success: false, message: student.message })
			}
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
	async getName(req, res) {
		try {
			const { students } = req.body
			const studentData = await studentService.getName(students)
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
	async getOne(req, res) {
		try {
			const { id } = req.params
			const studentData = await studentService.getOne(id)
			if (studentData.success) {
				return res.status(200).json(studentData)
			}
			return res.status(404).json({ studentData })
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
	async StudentDelete(req, res) {
		try {
			const { studentId } = req.params
			const studentData = await studentService.StudentDelete(studentId)
			if (studentData.success) {
				return res.status(200).json(studentData)
			}
			return res.status(404).json({ studentData })
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
	async StudentArchived(req, res) {
		try {
			const { studentId } = req.params
			const studentData = await studentService.StudentArchived(studentId)
			if (studentData.success) {
				return res.status(200).json(studentData)
			}
			return res.status(404).json({ studentData })
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
}

module.exports = new StudentController()