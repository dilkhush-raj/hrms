import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  getAllUsers,
  getCandidateUsers,
  getEmployeeUsers,
  createUsers,
  updateusers,
  deleteUser,
  getUserById,
  updateUserStatus,
  updateUser,
  updateEmployee,
} from '../controllers/user.controller';

const router = Router();
router.route('/all').get(verifyJWT, getAllUsers);
router.route('/candidates').get(verifyJWT, getCandidateUsers);
router.route('/employees').get(verifyJWT, getEmployeeUsers);
router.route('/updateUserStatus/:id').put(verifyJWT, updateUserStatus);
router.route('/createuser').post(verifyJWT, createUsers);
router.route('/user/:id').get(getUserById);
router.route('/updateUser/:id').put(verifyJWT, updateusers);
router.route('/deleteUser/:id').delete(verifyJWT, deleteUser);
router.route('/update/:id').put(updateUser);
router.route('/update-employees/:id').put(verifyJWT, updateEmployee);

export default router;
