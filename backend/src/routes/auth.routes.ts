import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  createUser,
  loginUser,
  deleteUser,
  changePassword,
  updateUserRole,
  logOutUser,
  isLoggedIn,
} from '../controllers/auth.controller';

const router = Router();

router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/delete').post(deleteUser);
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/update-role').post(verifyJWT, updateUserRole);
router.route('/logout').post(verifyJWT, logOutUser);
router.route('/check-auth').get(verifyJWT, isLoggedIn);

export default router;
