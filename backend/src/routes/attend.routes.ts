import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  createAttend,
  deleteAttend,
  getAttends,
  updateAttend,
  updateAttendStatus,
} from '../controllers/Attend.controller';

const router = Router();

router.route('/createAttendence').post(verifyJWT, createAttend);
router.route('/attendance').get(verifyJWT, getAttends);
router.route('/updateAttendence').patch(verifyJWT, updateAttend);
router.route('/delete/:id').delete(verifyJWT, deleteAttend);
router.route('/updateAttendenceStatus/:id').put(verifyJWT, updateAttendStatus);

export default router;
