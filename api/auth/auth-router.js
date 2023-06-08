const router = require('express').Router();
const userMdl = require('../users/users-model');
const { isEmailExist, hashPassword, passwordCheck, generateToken, restricted, logout } = require('./auth-middleware');
const { payloadCheck } = require('../users/users-middleware');



router.post("/register", payloadCheck, hashPassword, async (req, res, next) => {
    const { username, password, email} = req.body;
  
    const newUser = { 
      username: username,
      password: password,
      email: email
    };
  
    try {
      const savedUser = await userMdl.create(newUser);
      res
        .status(200)
        .json({ message: "User successfully created.", savedUser });
    } catch (error) {
      next(error);
    }
  });

router.post('/login', isEmailExist, passwordCheck, generateToken, async (req,res,next)=>{
    try {
        const user = req.user;
        const token = user.token;
        res.json({message: `Welcome back ${user.username}...`, token})

    } catch(err){
        next(err)
    }
})

router.get('/logout', restricted, logout, async (req,res,next)=>{
  try {
      const username = req.decodedUser.username;
      res.json({message: `Get back soon ${username}...`})

  } catch(err){
      next(err)
  }
})



module.exports = router;