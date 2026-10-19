const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const { validateProduct, validateId } = require('../middleware/validate.middleware');

router.get('/', ctrl.getAll);
router.get('/categories', ctrl.getCategories);
router.get('/:id', validateId, ctrl.getOne);
router.post('/', validateProduct, ctrl.create);
router.put('/:id', validateId, validateProduct, ctrl.update);
router.delete('/:id', validateId, ctrl.remove);

module.exports = router;
