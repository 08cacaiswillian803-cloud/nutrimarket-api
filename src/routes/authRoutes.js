const router=require('express').Router();const {register,login,me}=require('../controllers/authController');const {protect}=require('../middlewares/auth');const {registerRules,loginRules}=require('../validators/authValidators');
router.post('/register',registerRules,register);router.post('/login',loginRules,login);router.get('/me',protect,me);module.exports=router;
