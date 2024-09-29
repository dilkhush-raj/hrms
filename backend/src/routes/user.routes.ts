import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  getAllUsers,
  getCandidateUsers,
  getEmployeeUsers,
} from '../controllers/user.controller';

const router = Router();
router.route('/all').get(verifyJWT, getAllUsers);
router.route('/candidates').get(verifyJWT, getCandidateUsers);
router.route('/employees').get(verifyJWT, getEmployeeUsers);

export default router;
