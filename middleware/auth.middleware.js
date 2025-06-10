const jwt  = require('jsonwebtoken')

const auth=(req,res,next)=>{
	const token = req.headers.authorization?.split(" ")[1]

	if(!token){
		return res.status(401).json({message:'Token yoq', success:false})
	}
	try {
		const decoded = jwt.verify(token,process.env.SECRET_KEY)
		req.user = decoded
		next()
	} catch (error) {
		return <div>{error}</div>
	}
}
module.exports = auth