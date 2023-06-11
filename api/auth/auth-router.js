const router = require("express").Router();
const userMdl = require("../users/users-model");
const {
  isEmailExist,
  hashPassword,
  passwordCheck,
  generateToken,
  restricted,
  logout,
} = require("./auth-middleware");
const { payloadCheck } = require("../users/users-middleware");

// register da kayıt oluşturuyoruz. bizim yazdığımız middle wareleri kontrol ediyor. payload check de şifremiz username imiz isteiğimiz uzunlukta mı vs vs bunları kontrol ediyor.
// hash password da oluşturduğumuz parolayı hashliyor.
router.post("/register", payloadCheck, hashPassword, async (req, res, next) => {
  const { username, password, email } = req.body;

  const newUser = {
    username: username,
    password: password,
    email: email,
  };

  try {
    const savedUser = await userMdl.create(newUser); // usermdl bizim tabloya göre kullanıcıya id oluşturuyor.
    res.status(200).json({ message: "User successfully created.", savedUser });
  } catch (error) {
    next(error);
  }
});
// burada maili kontrol ediyor geçerli mi diye aynı zamanda parolayı
//sonra da token oluşturuyor
router.post(
  "/login",
  isEmailExist,
  passwordCheck,
  generateToken,
  async (req, res, next) => {
    try {
      const user = req.user;
      const token = user.token;
      res.json({ message: `Welcome back ${user.username}...`, token });
    } catch (err) {
      next(err);
    }
  }
);
//restricted ı token geçerli mi onu kontrol ediyor.
router.get("/logout", restricted, logout, async (req, res, next) => {
  try {
    const username = req.decodedUser.username;
    res.json({ message: `Get back soon ${username}...` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
