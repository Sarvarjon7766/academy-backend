const cron = require('node-cron');
const {deleteOldMessages} = require('./message.delete'); 
const {paymentCreate,MonthlyBill} = require('../services/studentpayment.service')

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

const runMonthlyBillCron = () => {
  // Har oyning 28–31 kunlari 22:00 da ishga tushadi
  cron.schedule('0 22 28-31 * *', async () => {
    try {
      const now = new Date();
      const today = now.getDate();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Hozirgi oydagi oxirgi kunni hisoblab olamiz
      const lastDay = new Date(year, month, 0).getDate();

      // Agar bugungi sana oxirgi kunga teng bo‘lsa, MonthlyBill ishga tushadi
      if (today === lastDay) {
        console.log(`[CRON] ${year}-${month}-${today} - Oxirgi kun. MonthlyBill boshlanmoqda...`);
        const result = await MonthlyBill();
        console.log(`[CRON] MonthlyBill natija:`, result.message);
      } else {
        console.log(`[CRON] ${year}-${month}-${today} - Bu oxirgi kun emas, o'tkazildi.`);
      }
    } catch (error) {
      console.error('[CRON] MonthlyBill bajarishda xatolik:', error.message);
    }
  });
};

module.exports = {
  runCronJob,
  runStudentPayment,
  runMonthlyBillCron
};
