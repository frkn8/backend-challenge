const userMdl = require('./users-model');

const payloadCheck = (req,res,next) => {
    try {
        const { username, email, password} = req.body;
       
       if(!username || !username.trim() || username.length < 6) {
            next({status: 400, message: "Kullanıcı adı 6 karakterden büyük olmalı!..."})
        } else if(!email || !email.trim() || !isEmailValid(email)) {
            next({status: 400, message: "Geçerli bir email adresi giriniz!..."}) 
        } else if(!password || !password.trim() || password.length < 3) {
            next({status: 400, message: "Şifreniz en az üç karakter olmalı!..."})
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
}

const isIdExist = async (req,res,next)=>{
    try {
        const { id } = req.params;
        const users = await userMdl.getByFilter({"user_id": id});
        if(users.length == 0) {
            next({status: 404, message: `${id} id'li kullanıcı bulunamadı!...`})
        } else {
            req.user = users[0];
            next()
        }

    } catch (err) {
        next(err)
    }
}

const isEmailValid = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  module.exports = {
    payloadCheck,
    isIdExist,
}