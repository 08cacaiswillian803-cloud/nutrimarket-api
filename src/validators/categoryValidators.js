const {body,param}=require('express-validator');const validateRequest=require('../middlewares/validateRequest');
const createRules=[body('name').trim().isLength({min:2,max:60}).withMessage('Nombre de categoría requerido'),body('slug').optional().trim().isSlug().withMessage('Slug inválido'),body('description').optional().isString().isLength({max:300}),validateRequest];
const updateRules=[param('id').isMongoId().withMessage('ID inválido'),body('name').optional().trim().isLength({min:2,max:60}),body('slug').optional().trim().isSlug(),body('description').optional().isString().isLength({max:300}),body('active').optional().isBoolean(),validateRequest];
module.exports={createRules,updateRules};
