const jwt = require("jsonwebtoken");

exports.checkValidation = async (req,res) => {
    const {token} = req.body;
    let output;
    jwt.verify(token,"DUTCHAPPLICATION@1234512132sdfsdf",(err,user)=>{
        if(err || !user){
            output = {
                statusCode:401,
                error:"Invalid Token"
            }
        }else{
            req.user = user;
             output = {
                statusCode:200,
                user
            }
        }
    });
    return output;
}