const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Token mavjud emas" });
    }

    try {
        console.log(process.env.SECRET_KEY)
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY); 
        req.user = verified; 
        console.log('Salom')
        console.log(verified)
        console.log('Salom')
        next();
    } catch (err) {
        return res.status(403).json({ message: "Noto‘g‘ri yoki eskirgan token" });
    }
};

module.exports = verifyToken;
