import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  createAttend,
  deleteAttend,
  getAttends,
  updateAttend,
} from '../controllers/Attend.controller';

const router = Router();

router.route('/createAttendence').post(verifyJWT, createAttend);
router.route('/getAttendence').get(verifyJWT, getAttends);
router.route('/updateAttendence').patch(verifyJWT, updateAttend);
router.route('/deleteAttendence').delete(verifyJWT, deleteAttend);

export default router;
