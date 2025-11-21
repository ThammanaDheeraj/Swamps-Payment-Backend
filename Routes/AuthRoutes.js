const { signup, login, updatePass } = require('../Controllers/AuthController');
const { signupSchema, loginSchema, updatePassSchema } = require('../MiddleWares/AuthValidation');
const Auth=require('../MiddleWares/Auth');
const router=require('express').Router();

router.post('/signup',signupSchema,signup);
router.post('/login',loginSchema,login);
router.post('/updatepass',Auth,updatePassSchema,updatePass);

module.exports=router;