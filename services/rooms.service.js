const { default: mongoose } = require('mongoose')
const roomModel = require('../modules/rooms.model')
const studentModel = require('../modules/student.model')

class RoomsService {
  async create(data) {
    try {
      const newData = {
        roomNumber: data.number,
        roomCapacity: data.capacity,
        beds: Array(parseInt(data.capacity)).fill(null)
      }

      console.log(newData)

      const room = await roomModel.create(newData)

      if (room) {
        return { success: true, message: "Xona qo‘shildi", room }
      }

      return { success: false, message: "Xona qo‘shishda xatolik" }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async GetAll() {
    try {
      const rooms = await roomModel.find()

      const populatedRooms = await Promise.all(
        rooms.map(async (room) => {
          const populatedBeds = await Promise.all(
            room.beds.map(async (bed) => {
              if (!bed) return "Yotoq-joy bo'sh"

              const student = await studentModel.findById(bed)
              return student ? student.fullName : "Noma'lum talaba"
            })
          )

          return {
            roomNumber: room.roomNumber,
            roomCapacity: room.roomCapacity,
            beds: populatedBeds,
          }
        })
      )
      if (populatedRooms.length > 0) {
        return { success: true, data: populatedRooms }
      }
      return { success: false, data: [], message: "Xonalar topilmadi." }
    } catch (error) {
      console.error("Xatolik:", error)
      return { success: false, message: "Xona olishda xatolik yuz berdi." }
    }
  }

  async CheckStudent(studentId) {
    try {
      const rooms = await roomModel.find()

      const matchedRoom = rooms.find(room =>
        room.beds.some(bed => bed && bed.toString() === studentId.toString())
      )
      console.log('Salom')
      console.log(matchedRoom)

      if (matchedRoom) {
        return {
          success: true,
          room: {
            _id: matchedRoom._id,
            roomNumber: matchedRoom.roomNumber,
            roomCapacity: matchedRoom.roomCapacity
          }
        }
      } else {
        return {
          success: false,
          message: "Student hech qaysi xonaga biriktirilmagan."
        }
      }

    } catch (error) {
      console.error("Xatolik:", error)
      return { success: false, message: "Xona olishda xatolik yuz berdi." }
    }
  }

  async AddHotelToStudent(sId, data) {
    try {
      const studentId = new mongoose.Types.ObjectId(sId.studentId)
      const room = await roomModel.findOne({ roomNumber: data.roomNumber })
      if (!room) {
        return { success: false, message: "Xona topilmadi" }
      }

      if (data.bedIndex < 0 || data.bedIndex >= room.beds.length) {
        return { success: false, message: "Yotoq mavjud emas" }
      }
      room.beds[data.bedIndex] = new mongoose.Types.ObjectId(studentId)
      await room.save()
      return { success: true, message: "Yotoq muvaffaqiyatli biriktirildi" }
    } catch (error) {
      console.error("Xatolik:", error)
      return { success: false, message: "Xona biriktirishda xatolik yuz berdi." }
    }
  }

}

module.exports = new RoomsService()