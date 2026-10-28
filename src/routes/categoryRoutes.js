const router = require('express').Router();
const controller = require('../controllers/categoryController');
const { validarCategoria } = require('../validators/categoryValidators');
router.get('/', controller.listar);
router.post('/', validarCategoria, controller.crear);
router.put('/:id', validarCategoria, controller.actualizar);
router.delete('/:id', controller.eliminar);
module.exports = router;
