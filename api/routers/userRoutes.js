const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

router.get('/', userController.index);
router.get('/:role', userController.getByRole);
router.get('/security-questions', userController.getSecurityQuestions);
router.post('/', userController.createUser);
router.delete('/:id', userController.destroy);
// router.put('/:id', userController.update);

module.exports = router;