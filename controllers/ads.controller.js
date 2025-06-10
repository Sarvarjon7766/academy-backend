const {createAd,getAll,update,deleted} = require('../services/ads.service')
class ApplicationController {
    async create(req, res) {
        try {
            const data = req.body;
            if (!data || !data.title || !data.description) {
                return res.status(400).json({ success: false, message: 'Invalid data' });
            }
            const result = await createAd(data, req.filePath);
            if (result.success) {
                return res.status(201).json({
                    success: true,
                    message: "E'lon muvaffaqiyatli saqlandi",
                    data: result.data
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Serverda xatolik yuz berdi',
                    error: result.message
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Serverda xatolik yuz berdi',
                error: error.message
            });
        }
    }
    async getAll(req,res){
        try {
            const alldata = await getAll()
            return res.status(200).json({success:true,alldata:alldata.alldata})
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Serverda xatolik yuz berdi',
                error: error.message
            });
        }
    }
    async update(req,res){
        try {
            const data = req.body;
            const {id} = req.params

            if (!data || !data.title || !data.description || !id) {
                return res.status(400).json({ success: false, message: 'Invalid data' });
            }
            const Data = {...data,photo:req.filePath}
            const result = await update(id,Data);
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: "E'lon muvaffaqiyatli yangilandi",
                    data: result.data
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Serverda xatolik yuz berdi',
                    error: result.message
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Serverda xatolik yuz berdi',
                error: error.message
            });
        }
    }
    async deleted(req,res){
        try {

            const {id} = req.params
            const data = await deleted(id)
            if(data.success){
                return res.status(200).json(data)
            }
            return res.status(500).json({success:false,message:'E\'lon o\'chirilmadi'})
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Serverda xatolik yuz berdi',
                error: error.message
            });
        }

    }
}

module.exports = new ApplicationController();
