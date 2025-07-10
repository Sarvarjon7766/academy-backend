const cron = require('node-cron');
const {deleteOldMessages} = require('./message.delete'); 
const {paymentCreate} = require('../services/studentpayment.service')

const runCronJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      await deleteOldMessages();  
    } catch (error) {
    }
  });
};

const runStudentPayment = () => {
  cron.schedule('0 0 1 * *',async ()=>{
    try {
      const data = await paymentCreate()
      if(data.success){
        console.log("Muvafaqiyatli yaratildi")
      }else{
        console.log("Yaratishda xatolik bo'ldi")
      }
    } catch (error) {
      console.error('Error creating student payments:', error);
    }
  })
}

module.exports = {
  runCronJob,
  runStudentPayment
};
