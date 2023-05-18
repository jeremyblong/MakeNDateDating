const CryptoJS = require("crypto-js");
const config = require("config");
const crypto = require("crypto");
const secretKey = config.get("cryptoSecret");
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// string decrypt/encrypt
const encrypt = (text) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}
const decrypt = (text) => {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// string decrypt/encrypt
const encryptString = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

const decryptString = (hash) => {

    const bytes  = CryptoJS.AES.decrypt(hash, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
};
// object encyption/decryption
const encryptObject = (obj) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), secretKey).toString();

    return ciphertext;
};

const decryptObject = (hash) => {

    const bytes  = CryptoJS.AES.decrypt(hash, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
};

module.exports = {
    encryptString,
    decryptString,
    decryptObject,
    encryptObject,
    encrypt,
    decrypt
};