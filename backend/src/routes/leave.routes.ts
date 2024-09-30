import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  createLeave,
  deleteLeave,
  getAllLeaves,
  getLeavesbydates,
  getTodayLeaves,
  updateLeave,
} from '../controllers/leave.controller';

const router = Router();

router.route('/createLeave').post(verifyJWT, createLeave);
router.route('/getLeaves').get(verifyJWT, getAllLeaves);
router.route('/getTodayLeaves').get(verifyJWT, getTodayLeaves);
router.route('/getLeavesBydate').get(verifyJWT, getLeavesbydates);
router.route('/updateLeave').patch(verifyJWT, updateLeave);
router.route('/deleteLeave').delete(verifyJWT, deleteLeave);

export default router;
