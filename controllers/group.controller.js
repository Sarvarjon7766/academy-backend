const { default: mongoose } = require('mongoose')
const groupService = require('../services/group.service')
const GroupService = require('../services/group.service')

class GroupController {
	async create(req, res) {
		try {
			const { subjectId } = req.params
			const { groupName } = req.body
			const teacherId = req.user.id

			const newgroup = await GroupService.create(teacherId, subjectId, groupName)
			if (newgroup && newgroup.success) {
				return res.status(201).json(newgroup)
			}
			return res.status(400).json(newgroup.message)
		} catch (error) {
			return res.status(500).json(error)
		}
	}
	async groupForStudents(req, res) {
		try {
			const data = await GroupService.groupForStudents(req.params.groupId)
			if (data && data.success) {
				res.status(200).json({ success: true, message: "Talaba ma'lumotlari", students: data.students })
			} else {
				res.status(200).json({ success: false, message: "Guruhda talabalar mavjud emas" })
			}
		} catch (error) {
			return res.status(500).json(error)
		}
	}
	async teacherSubjectGroup(req, res) {
		try {
			// console.log(req.params)
			// console.log(req.user)
			let techId
			const { teacherId, subjectId } = req.params

			if (teacherId !== undefined) {
				techId = teacherId // Corrected assignment
			} else {
				techId = req.user.id
			}

			// console.log(techId)

			const group = await GroupService.teacherSubjectGroup(techId, subjectId)
			if (group && group.success) {
				return res.status(200).json(group)
			} else {
				console.log(group.message)
				return res.status(200).json(group)
			}
		} catch (error) {
			return res.status(500).json(error)
		}
	}
	async getGroups(req, res) {
		try {
			const user = req.user
			const groups = await groupService.teacherGroups(user.id)
			if (groups.success) {
				return res.status(200).json(groups)
			}
			return res.status(404).json(groups)
		} catch (error) {
			return res.status(500).json(error)
		}
	}
	async teacherGroups(req, res) {
		try {
			const user = req.user
			const groups = await groupService.groupStudents(user.id)
			if (groups.success) {
				return res.status(200).json(groups)
			}
			return res.status(404).json(groups)
		} catch (error) {
			return res.status(500).json(error)
		}
	}
	async CountStudent(req, res) {
		try {
			const id = req.user.id
			const data = await groupService.CountStudent(id)

			if (data.success) {
				return res.status(200).json(data)
			}
			return res.status(404).json(data)
		} catch (error) {
			return res.status(500).json(error)
		}
	}
	async getStudents(req, res) {
		try {
			const teacherId = req.user.id
			const { subjectId } = req.params
			const tId = new mongoose.Types.ObjectId(teacherId)
			const sId = new mongoose.Types.ObjectId(subjectId)
			const data = await groupService.getStudents(tId, sId)
			if (data.success) {
				return res.status(200).json(data)
			} else {
				return res.status(404).json(data)
			}

		} catch (error) {
			return res.status(500).json(error)
		}
	}
	async getGrouptoStudents(req, res) {
		try {
			const teacherId = req.user.id
			const { subjectId } = req.params

			const tId = new mongoose.Types.ObjectId(teacherId)
			const sId = new mongoose.Types.ObjectId(subjectId)
			const data = await groupService.getGrouptoStudents(tId, sId)
			if (data.success) {
				return res.status(200).json(data)
			} else {
				return res.status(404).json(data)
			}

		} catch (error) {
			return res.status(500).json(error)
		}
	}
	async getTeacherGroup(req, res) {
		try {
			const {subjectId,teacherId} = req.query
			const tId = new mongoose.Types.ObjectId(teacherId)
			const sId = new mongoose.Types.ObjectId(subjectId)
			const data = await groupService.getGrouptoStudents(tId, sId)
			if (data.success) {
				return res.status(200).json(data)
			} else {
				return res.status(404).json(data)
			}

		} catch (error) {
			return res.status(500).json(error)
		}
	}

	async GetSubject(req,res){
		try {
			const teacherId = req.user.id
			const { groupId } = req.params
			const subject = await GroupService.GetSubject(teacherId,groupId)
			if(subject.success){
				return res.status(200).json(subject)
			}
			return res.status(404).json(subject)
		} catch (error) {
			return res.status(500).json(error)
		}
	}

	async RelocationGroup(req,res){
		try {
			const teacherId = req.user.id
			const { groupId,studentId,selectedGroupId } = req.params
			const data = await GroupService.RelocationGroup(teacherId,groupId,studentId,selectedGroupId)
			if(data.success){
				return res.status(200).json(data)
			}
			return res.status(404).json(data)
		} catch (error) {
			return res.status(500).json(error)
		}
	}
}

module.exports = new GroupController()