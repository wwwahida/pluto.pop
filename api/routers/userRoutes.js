const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

router.get('/', userController.index);
router.get('/security-questions', userController.getSecurityQuestions);
router.get('/:role', userController.getByRole);
router.delete('/:id', userController.destroy);
// router.put('/:id', userController.update);

module.exports = router;