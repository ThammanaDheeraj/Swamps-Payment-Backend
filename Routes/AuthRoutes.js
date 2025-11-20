const { signup, login } = require('../Controllers/AuthController');
const { signupSchema, loginSchema } = require('../MiddleWares/AuthValidation');
const router=require('express').Router();

router.post('/signup',signupSchema,signup);
router.post('/login',loginSchema,login);

module.exports=router;