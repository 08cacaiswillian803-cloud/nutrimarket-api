const router=require('express').Router();const c=require('../controllers/orderController');const {protect,restrictTo}=require('../middlewares/auth');const {createOrderRules}=require('../validators/orderValidators');
router.use(protect);router.post('/',createOrderRules,c.create);router.get('/mine',c.mine);router.get('/',restrictTo('admin'),c.listAll);router.get('/:id',c.getOne);module.exports=router;

