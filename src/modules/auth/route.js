import express from "express";
import * as authController from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/verify-account", authController.verifyAccount);
router.post("/verify-code", authController.verifyCode);
router.post("/login", authController.login);
router.post("/login-failed", authController.loginFailed);
router.post("/refresh", authenticate, authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.post("/get-current-user", authenticate, authController.getCurrentUser);
router.post("/update-current-user", authenticate, authController.updateCurrentUser);
router.post("/resend-verification", authController.resendVerification);
router.post("/set-password", authController.setPassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/test", authController.test);

export default router;