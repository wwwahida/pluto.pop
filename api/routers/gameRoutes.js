const { Router } = require('express');
const gameController = require('../controllers/gameController');
const authenticator = require('../middleware/authenticator');

const router = Router();

router.get('/', gameController.index);
router.get('/:topic', gameController.show);
router.post('/', authenticator, gameController.create);
router.delete('/:id', authenticator, gameController.destroy);
router.put('/:id', authenticator, gameController.update);

module.exports = router;