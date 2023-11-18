const crypto = require("crypto");

const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);
    
const encryptMsg = (message) => {
    
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

    let encryptedData = cipher.update(message, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    return encryptedData

}

const decryptMsg = (encryptedData) => {
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    decipher.setAutoPadding(false)
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

    decryptedData += decipher.final("utf8");

    return decryptedData
}

module.exports = {
    encryptMsg,
    decryptMsg
}