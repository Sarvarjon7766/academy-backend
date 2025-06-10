const cron = require('node-cron');
const {deleteOldMessages} = require('./message.delete'); 

const runCronJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      await deleteOldMessages();  
    } catch (error) {
    }
  });
};

module.exports = runCronJob;
