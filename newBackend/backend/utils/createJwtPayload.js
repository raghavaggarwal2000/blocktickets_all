const createJwtPayload = (user) =>{
    return{
        userId: user._id,
        role: user.role,
        phoneNumber: user.phoneNumber,
        name: user.firstName,
        email: user.email
    }
};

module.exports = {createJwtPayload}