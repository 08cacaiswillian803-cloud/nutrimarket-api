const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const registerRules=[body('name').trim().isLength({min:2,max:80}).withMessage('El nombre debe tener entre 2 y 80 caracteres'),body('email').trim().isEmail().withMessage('Correo inválido').normalizeEmail(),body('password').isString().isLength({min:8,max:72}).withMessage('La contraseña debe tener entre 8 y 72 caracteres'),body('phone').optional().isString().isLength({max:25}).withMessage('Teléfono demasiado largo'),validateRequest];
const loginRules=[body('email').trim().isEmail().withMessage('Correo inválido').normalizeEmail(),body('password').isString().notEmpty().withMessage('La contraseña es obligatoria'),validateRequest];
module.exports={registerRules,loginRules};
