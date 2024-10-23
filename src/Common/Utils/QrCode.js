import QRCode from "qrcode"
export const makeQrCode = async (data) => await QRCode.toDataURL(JSON.stringify(data), { errorCorrectionLevel: "H" })