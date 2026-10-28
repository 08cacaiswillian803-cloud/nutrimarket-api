const {body}=require('express-validator');const validateRequest=require('../middlewares/validateRequest');
const createOrderRules=[body('items').isArray({min:1,max:50}).withMessage('items debe contener entre 1 y 50 productos'),body('items.*.productId').isMongoId().withMessage('productId inválido'),body('items.*.quantity').isInt({min:1,max:100}).withMessage('quantity debe ser un entero de 1 a 100'),validateRequest];
module.exports={createOrderRules};
