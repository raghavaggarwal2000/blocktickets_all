const jwt = require("jsonwebtoken");


const createJwtToken = (user) =>{
    return jwt.sign(user, process.env.JWT_SECRET,{
        expiresIn:'6h'
    })
}
const verifyJwtToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodeData) =>{
        if(err) return false;
        return decodeData;
    })




module.exports = {createJwtToken, verifyJwtToken};