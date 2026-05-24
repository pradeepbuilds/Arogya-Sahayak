const QRCode = require("qrcode");

const generateQR = async (workerId) => {
  const baseUrl = process.env.QR_BASE_URL || "http://localhost:5000";
  const publicUrl = `${baseUrl}/api/v1/public/worker/${workerId}`;

  const qrCode = await QRCode.toDataURL(publicUrl, {
    width: 300,
    margin: 2,
  });

  return {
    qrCode,
    publicUrl,
  };
};

module.exports = generateQR;