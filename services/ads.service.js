const adsModel = require('../modules/ads.model'); 

class AdsService {

    async createAd(data, photoPath) {
        try {

            const newAd = new adsModel({
                photo: photoPath,  
                title: data.title,
                description: data.description,
            });

            const savedAd = await newAd.save();
            return { success: true, data: savedAd };  
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    async getAll(){
        try {
            const alldata = await adsModel.find()
            if(alldata){
                return {success:true,alldata}
            }
            return {success:false,message:"E'lonlar toplmadi"}
        } catch (error) {
            return {success:false,message:error.message}
        }
    }
    async update(id,data){
        try {
            const ads = await adsModel.findByIdAndUpdate(id,data)
            if(ads){
                return {success:true,ads}
            }
            return {success:false,message:"E'lon yangilanmadi"}
        } catch (error) {
            return {success:false,message:error.message}
        }
    }
    async deleted(id){
        try {
            const ad = await adsModel.findByIdAndDelete(id)
            if(ad){
                return {success:true,ad}
            }
            return {success:false,message:"E'lon yangilanmadi"}
        } catch (error) {
            return {success:false,message:error.message}
        }
    }
    
}

module.exports = new AdsService();
