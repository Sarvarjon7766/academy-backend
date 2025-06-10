const fs = require('fs');
const path = require('path');

const DeletePhoto = (req, res, next) => {
	const photoPath = path.join(__dirname, '..', req.body.photo);
  if (fs.existsSync(photoPath)) {
    fs.unlink(photoPath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Rasmni o\'chirishda xatolik yuz berdi.' });
      }
      next();
    });
  } else {
    next(); 
  }
};

module.exports = DeletePhoto;
