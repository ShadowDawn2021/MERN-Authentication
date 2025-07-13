import express from "express";
import {
  isAuthenticated,
  logIn,
  logout,
  passReset,
  register,
  sendResetOTP,
  sendVerificationOTP,
  verifyEmail,
} from "../controllers/authControler.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", logIn);
router.post("/logout", logout);
router.post("/send-verify-otp", userAuth, sendVerificationOTP);
router.post("/verify-account", userAuth, verifyEmail);
router.post("/isAuth", userAuth, isAuthenticated);
router.post("/send-reset-password", sendResetOTP);
router.post("/resetPassword", passReset);
export default router;
