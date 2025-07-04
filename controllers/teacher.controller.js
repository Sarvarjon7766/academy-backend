const { default: mongoose } = require('mongoose')
const teacherService = require('../services/teacher.service')

class TeacherController{
	async createPersonal(req,res){
		try {
			const updateSubject = await teacherService.createPersonal(req.body)
			if(updateSubject && updateSubject.success){
				res.status(201).json(updateSubject)
			}else{
			res.status(404).json(newTeacher)}
		} catch (error) {
			res.status(500).json({message:error.message,success:false})
		}
	}
	async updatePersonal(req,res){
		try {
			console.log(res.body)
			console.log(res.params)
			const updateSubject = await teacherService.updatePersonal(req.params.id,req.body)
			if(updateSubject && updateSubject.success){
				res.status(200).json(updateSubject)
			}else{
			res.status(404).json(newTeacher)}
		} catch (error) {
			res.status(500).json({message:error.message,success:false})
		}
	}
	async AddSubjects(req,res){
		try {
			console.log(req.body)
			const newTeacher = await teacherService.AddSubjects(req.body)
			if(newTeacher && newTeacher.success){
				res.status(200).json(newTeacher)
			}else{
			res.status(404).json(newTeacher)}
		} catch (error) {
			res.status(500).json({message:error.message,success:false})
		}
	}
	async CheckSubject(req,res){
		try {
			const newTeacher = await teacherService.CheckSubject(req.params.id)
			if(newTeacher && newTeacher.success){
				res.status(200).json(newTeacher)
			}else{
			res.status(404).json(newTeacher)}
		} catch (error) {
			res.status(500).json({message:error.message,success:false})
		}
	}
	async CheckSalary(req,res){
		try {
			const newTeacher = await teacherService.CheckSalary(req.params.id)
			if(newTeacher && newTeacher.success){
				res.status(200).json(newTeacher)
			}else{
			res.status(404).json(newTeacher)}
		} catch (error) {
			res.status(500).json({message:error.message,success:false})
		}
	}
	async AddSalary(req,res){
		try {
			const newTeacher = await teacherService.AddSalary(req.body)
			if(newTeacher && newTeacher.success){
				res.status(201).json(newTeacher)
			}else{
			res.status(404).json(newTeacher)}
		} catch (error) {
			res.status(500).json({message:error.message,success:false})
		}
	}
	async getTeacher(req,res){
		try {
			const newTeacher = await teacherService.getTeacher(req.params.id)
			if(newTeacher && newTeacher.success){
				res.status(201).json(newTeacher)
			}else{
			res.status(404).json(newTeacher)}
		} catch (error) {
			res.status(500).json({message:error.message,success:false})
		}
	}

	async login(req,res){
		try {
				const {login,password} = req.body
				const teacher = await teacherService.login(login,password)
				if(teacher.success){
					return res.status(200).json(teacher)
				}
				return res.status(404).json(teacher)
		} catch (error) {
			return res.status(500).json({message:error,success:false})
		}
	}
	async getAll(req,res){
		try {
				const teachers = await teacherService.getAll()
				if(teachers.success){
					return res.status(200).json(teachers)
				}
				return res.status(404).json(teachers)
		} catch (error) {
			return res.status(500).json({message:error,success:false})
		}
	}
	async getOne(req,res){
		try {
			const user = await teacherService.getOne(req.user)
			if(user.success){
				return res.status(200).json(user)
			}
			return res.status(404).json(user)
		} catch (error) {
			return res.status(500).json({message:error,success:false})
		}
	}
	async ChangePassword(req,res){
		try {
			const {id} = req.params
			const {password} = req.body
			const data = await teacherService.ChangePassword(id,password)
			if(data.success){
				return res.status(200).json(data)
			}
			return res.status(500).json(data)
		} catch (error) {
			return res.status(500).json({message:error,success:false})
		}
	}
	async getSubjects(req,res){
		try {
				let newId
				const {id} = req.params
				if(id){
				newId = new mongoose.Types.ObjectId(id)
				}else{
					newId = new mongoose.Types.ObjectId(req.user.id)
				}
				const teachers = await teacherService.getSubjects(newId)
				if(teachers.success){
					return res.status(200).json(teachers)
				}
				return res.status(404).json(teachers)
		} catch (error) {
			return res.status(500).json({message:error,success:false})
		}
	}
	async update(req,res){
		try {
			const data = req.body
			const {id} = req.params
			const teacher = await teacherService.update(id,data)
			if(teacher.success){
				return res.status(200).json(teacher)
			}
			return res.status(404).json(teacher)
		} catch (error) {
			res.status(500).json({message:error,success:false})
		}
	}
	async deleted(req,res){
		try {
				const data = await teacherService.deleted(req.params.id)
				if(data.success){
					return res.status(200).json(data)
				}
				return res.status(404).json(data)
		} catch (error) {
			res.status(500).json({message:error,success:false})
		}
	}
	async subTeacher(req,res){
		try {
			const {subjectId} = req.params
			const teachers = await teacherService.subTeacher(subjectId)
			if(teachers.success){
				return res.status(200).json(teachers)
			}
			return res.status(400).json(teachers.message)
		} catch (error) {
			res.status(500).json({message:error,success:false})
		}
	}
	async TeacherSelery(req,res){
		try {
			
			const teachers = await teacherService.TeacherSelery(req.query)
			if(teachers.success){
				return res.status(200).json(teachers)
			}
			return res.status(400).json(teachers.message)
		} catch (error) {
			res.status(500).json({message:error,success:false})
		}
	}
	async getOneTeacherSalary(req,res){
		try {
			console.log(req.query)
			
			const teachers = await teacherService.getOneTeacherSalary(req.query)
			if(teachers.success){
				return res.status(200).json(teachers)
			}
			return res.status(400).json(teachers.message)
		} catch (error) {
			res.status(500).json({message:error,success:false})
		}
	}
}

module.exports = new TeacherController()