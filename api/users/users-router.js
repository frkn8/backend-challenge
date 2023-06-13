const router = require('express').Router();
const userMdl = require('./users-model');
const userMw = require('./users-middleware');

//tüm kullanıcıları görüntülüyoruz
router.get('/', async (req,res,next)=>{
    try {
        const users = await userMdl.getAll();
        res.json(users);
    } catch (err) {
        next(err)
    }
})
// belirli bir id ye göre kullanıcı çekiyor
router.get('/:id', userMw.isIdExist, async (req,res,next)=>{
    try {
        const { id } = req.params;
        const user = await userMdl.getById(id);
        res.json(user);
    } catch (err) {
        next(err)
    }
})
// id ye göre kullanıcıyı siliyor
router.delete('/:id', userMw.isIdExist, async (req,res,next)=>{
    try {
        const { id } = req.params;
        const count = await userMdl.remove(id);
        if(count){
            res.json({message: `${id}'li kullanıcı silindi.`})
        } else {
            res.status(404).json({message: `${id} id'li kullanıcı silinemedi!...`})
        }
        
    } catch (err) {
        next(err)
    }
})
// id ye göre kullanıcıyı düzenliyor
router.put('/:id', userMw.payloadCheck, userMw.isIdExist, async (req,res,next)=>{
    try {
        const { id } = req.params;
        const payload = req.body;
        const count = await userMdl.update(id, payload);
        if(count){
            res.json({message: `${id}'li kullanıcı güncellendi.`})
        } else {
            res.status(404).json({message: `${id} id'li kullanıcı güncellenemedi!...`})
        }
    } catch (err) {
        next(err)
    }
})


module.exports = router;