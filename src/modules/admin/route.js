import express from "express";
import * as adminController from "./controller.js";
import { authenticate, requireAdmin } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/get-users-by-admin", authenticate, requireAdmin, adminController.getUsersByAdmin);
router.post("/update-user", authenticate, requireAdmin, adminController.updateUser);
router.post("/delete-user", authenticate, requireAdmin, adminController.deleteUser);
router.post("/toggle-user-status", authenticate, requireAdmin, adminController.toggleUserStatus);
router.post("/toggle-user-verification", authenticate, requireAdmin, adminController.toggleUserVerification);
router.post("/get-admin-dashboard-stats", authenticate, requireAdmin, adminController.getAdminDashboardStats);
router.post("/get-user-activity", authenticate, requireAdmin, adminController.getUserActivity);
router.post("/get-all-activity", authenticate, requireAdmin, adminController.getAllActivity);
router.post("/delete-activity", authenticate, requireAdmin, adminController.deleteActivity);
router.post("/add-daily-verse", authenticate, requireAdmin, adminController.addDailyVerse);
router.post("/get-all-daily-verses", authenticate, requireAdmin, adminController.getAllDailyVerses);
router.post("/delete-daily-verse", authenticate, requireAdmin, adminController.deleteDailyVerse);

export default router;