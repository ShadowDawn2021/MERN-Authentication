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
  updateProfile,
} from "../controllers/authControler.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", logIn);
router.post("/logout", logout);
router.post("/send-verify-email", userAuth, sendVerificationOTP);
router.post("/verify-account", userAuth, verifyEmail);
router.post("/send-reset-password", sendResetOTP);
router.post("/resetPassword", passReset);
router.get("/isAuth", userAuth, isAuthenticated);
router.put("/update-profile", userAuth, updateProfile);
export default router;
