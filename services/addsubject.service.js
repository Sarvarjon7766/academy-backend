const addSubjectModel = require('../modules/addsubject.model')

class AddSubjectService {
  // Create new subject
  async create(data) {
    try {
      const newSubject = await addSubjectModel.create(data);
      return { success: true, message: "Qo'shimcha fan yaratildi", newSubject };
    } catch (error) {
      console.error("Error during create:", error);
      return { success: false, message: `Qo'shimcha fan yaratishda xatolik: ${error.message}` };
    }
  }

  // Fetch all subjects
  async getAll() {
    try {
      const addSubjects = await addSubjectModel.find();
      if (addSubjects && addSubjects.length > 0) {
        return { success: true, addSubjects };
      }
      return { success: false, message: "Qo'shimcha fanlar topilmadi" };
    } catch (error) {
      console.error("Error during fetch:", error);
      return { success: false, message: `Qo'shimcha fanlarni olishda xatolik: ${error.message}` };
    }
  }

  // Update an existing subject
  async update(id, data) {
    try {
      const updatedData = await addSubjectModel.findByIdAndUpdate(id, data, { new: true });
      if (updatedData) {
        return { success: true, message: "Fan yangilandi", updatedData };
      }
      return { success: false, message: "Fanni yangilashda xatolik: Ma'lumot topilmadi" };
    } catch (error) {
      console.error("Update error:", error);
      return { success: false, message: `Fanni yangilashda xatolik: ${error.message}` };
    }
  }
	async deleted(id){
		try {
			const deleteData = await addSubjectModel.findByIdAndDelete(id)
			return {success:true,message:"Data o'chirildi"}
		} catch (error) {
			return { success: false, message: `Fanni yangilashda xatolik: ${error.message}` };
		}
	}

}

module.exports = new AddSubjectService();
