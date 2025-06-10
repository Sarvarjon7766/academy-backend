const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Unikal nom berish uchun

const uploadFile = (req, res, next) => {
    const {personal} = req.body
    const newpersonal = JSON.parse(personal)
    console.log(newpersonal)
    const uploadDir = path.join(__dirname, '../static'); // Fayllarni saqlash katalogi

    
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir); // Agar katalog mavjud bo'lmasa, yaratish
    }
    
    if (req.files && req.files.photo) {
        const photo = req.files.photo  
        console.log(photo)
        if (req.body.oldPhoto) {
            const oldFilePath = path.join(__dirname, '../', req.body.oldPhoto);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath); // Eski faylni o‘chirish
            }
        }

        // Yangi fayl uchun unikal nom yaratish
        const uniqueFileName = uuidv4() + path.extname(photo.name);
        const filePath = path.join(uploadDir, uniqueFileName);

        // Yangi faylni saqlash
        photo.mv(filePath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Fayl saqlashda xatolik yuz berdi', error: err });
            }

            req.filePath = '/static/' + uniqueFileName; // Yangi fayl yo‘lini saqlash
            next(); // Keyingi middleware yoki controllerga o'tish
        });
    } else  {
        req.filePath = req.body.oldPhoto || ''; // Agar yangi fayl yuklanmasa, eski faylni saqlash
        next();
    }
};

module.exports = uploadFile;
