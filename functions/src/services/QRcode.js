const QRCode = require("qrcode");

module.exports = (text) => {
  const out = {
    flag: true,
  };
  QRCode.toDataURL(text, (err, url) => {
    if (err) {
      out.flag = false;
      out.error = err;
      return;
    }
    out.url = url;
  });

  return out;
};
