var QRCode = require('qrcode')
 
module.exports=function (text){
QRCode.toDataURL(text, function (err, url) {
  console.log(url)
})
}
