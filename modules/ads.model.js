const mongoose = require('mongoose');

// Reklama modelining sxemasi
const adsSchema = new mongoose.Schema({
    photo: { type: String, required: true },  // Reklama uchun foto
    title: { type: String, required: true },  // Reklama sarlavhasi
    description: { type: String, required: true },  // Reklama ta'rifi
    sent_date: { type: Date, required: true, default: Date.now }  // Reklama yuborilgan sana
});

// Reklama modelini yaratish
const Ads = mongoose.model('ad', adsSchema);

module.exports = Ads;
