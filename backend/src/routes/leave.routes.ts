import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  createLeave,
  deleteLeave,
  getAllLeaves,
  getLeaveCalendar,
  getLeavesbydates,
  getTodayLeaves,
  updateLeave,
  updateLeaveStatus,
} from '../controllers/leave.controller';

const router = Router();

router.route('/').get(verifyJWT, getAllLeaves);
router.route('/create').post(verifyJWT, createLeave);
router.route('/getTodayLeaves').get(verifyJWT, getTodayLeaves);
router.route('/getLeavesBydate').get(verifyJWT, getLeavesbydates);
router.route('/updateLeave').patch(verifyJWT, updateLeave);
router.route('/deleteLeave').delete(verifyJWT, deleteLeave);
router.route('/update-status/:id').put(verifyJWT, updateLeaveStatus);
router.route('/calendar').get(verifyJWT, getLeaveCalendar);

export default router;
