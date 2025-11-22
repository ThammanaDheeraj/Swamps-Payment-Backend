const EnsureAccount=require('../MiddleWares/EnsureAccount');
const Auth=require('../MiddleWares/Auth');
const { CreateAccount, CheckBalance, SendMoney, Transhistory, UPI } = require('../Controllers/PaymentsController');
const router=require('express').Router();

router.use(Auth);
router.post('/createaccount',CreateAccount);
router.get('/checkbalance',EnsureAccount,CheckBalance);
router.post('/sendmoney',EnsureAccount,SendMoney);
router.get('/history',EnsureAccount,Transhistory);
router.post('/upi',EnsureAccount,UPI);

module.exports=router;