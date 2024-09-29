import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  createUser,
  loginUser,
  deleteUser,
  changePassword,
  updateUserRole,
} from '../controllers/auth.controller';

const router = Router();

router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/delete').post(deleteUser);
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/update-role').post(verifyJWT, updateUserRole);

export default router;
