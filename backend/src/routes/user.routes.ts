import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  getAllUsers,
  getCandidateUsers,
  getEmployeeUsers,
  createUsers,
  updateusers,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();
router.route('/all').get(verifyJWT, getAllUsers);
router.route('/candidates').get(verifyJWT, getCandidateUsers);
router.route('/employees').get(verifyJWT, getEmployeeUsers);

router.route('/createuser').post(verifyJWT, createUsers);
router.route('/updateUser/:id').put(verifyJWT, updateusers);
router.route('/deleteUser/:id').delete(verifyJWT, deleteUser);

export default router;
