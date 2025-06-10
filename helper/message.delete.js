const messageModel = require('../modules/message.model');  // Sizning messageModel
class DeleteHalper {
  async deleteOldMessages() {
    try {
      const now = new Date(); 
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000); 

      const oldMessages = await messageModel.find({
        sent_date: { $lt: oneDayAgo } 
      });
      if (oldMessages.length > 0) {
 
        for (const message of oldMessages) {
          await messageModel.deleteOne({ _id: message._id });
        }
        return `${oldMessages.length} ta xabar o'chirildi.`;
      } else {
        return "Hech qanday eski xabar topilmadi.";
      }
    } catch (error) {
      throw new Error('Xabarlarni o\'chirishda xatolik yuz berdi.');
    }
  }
}

module.exports = new DeleteHalper();
