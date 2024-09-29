import {Router} from 'express';
import {
  sendVerificationEmail,
  resendVerificationEmail,
  verifyEmailOtp,
} from '../controllers/verifyEmail.controller';

const router = Router();

router.route('/sendVerificationEmail').post(sendVerificationEmail);
router.route('/resendVerificationEmail').post(resendVerificationEmail);
router.route('/verifyEmailOtp').post(verifyEmailOtp);

export default router;
