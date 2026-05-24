const CryptoJS = require("crypto-js");

const encryptData = (data) => {
  if (!data) return "";

  return CryptoJS.AES.encrypt(
    String(data),
    process.env.AADHAAR_ENCRYPTION_KEY
  ).toString();
};

const decryptData = (cipherText) => {
  if (!cipherText) return "";

  const bytes = CryptoJS.AES.decrypt(
    cipherText,
    process.env.AADHAAR_ENCRYPTION_KEY
  );

  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encryptData,
  decryptData,
};