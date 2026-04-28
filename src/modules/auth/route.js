import express from "express";
import * as authController from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/verify-account", authController.verifyAccount);
router.post("/verify-code", authController.verifyCode);
router.post("/login", authController.login);
router.post("/google-login", authController.googleLogin);
router.post("/complete-google-registration", authController.completeGoogleRegistration);
router.post("/login-failed", authController.loginFailed);
router.post("/refresh", authenticate, authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.post("/get-current-user", authenticate, authController.getCurrentUser);
router.post("/update-current-user", authenticate, authController.updateCurrentUser);
router.post("/update-password", authenticate, authController.updatePassword);
router.post("/resend-verification", authController.resendVerification);
router.post("/set-password", authController.setPassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/test", authController.test);

export default router;