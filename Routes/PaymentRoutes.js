const EnsureAccount=require('../MiddleWares/EnsureAccount');
const Auth=require('../MiddleWares/Auth');
const { CreateAccount, CheckBalance, SendMoney, Transhistory } = require('../Controllers/PaymentsController');
const router=require('express').Router();

router.use(Auth);
router.post('/createaccount',CreateAccount);
router.get('/checkbalance',EnsureAccount,CheckBalance);
router.post('/sendmoney/:recAccNum',EnsureAccount,SendMoney);
router.get('/history',EnsureAccount,Transhistory);

module.exports=router;