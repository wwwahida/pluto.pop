const { Router } = require('express');
const gameController = require('../controllers/gameController');

const router = Router();

router.get('/', gameController.index);
router.get('/:topic', gameController.show);
router.post('/', gameController.create);
router.delete('/:id', gameController.destroy);
router.put('/:id', gameController.update);

module.exports = router;