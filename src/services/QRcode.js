var QRCode = require('qrcode')

module.exports = function (text) {

    let out = {
        flag: true
    }
    QRCode.toDataURL(text, function (err, url) {
        if (err) {
            out.flag = false;
            out.error = err
            return;
        }

        log(url)
        out.url = url
    })

    return out
}