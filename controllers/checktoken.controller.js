
class CheckTokenController{
	async checktoken(req,res){
		try {
			user = req.user
			return res.status(200).json({success:true,teacherid:user.id})
		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports = new CheckTokenController()