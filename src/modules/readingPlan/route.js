import express from "express";
import * as readingPlanController from "./controller.js";
import { authenticate, requireAdmin } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticate, requireAdmin, readingPlanController.create);
router.post("/delete", authenticate, requireAdmin, readingPlanController.deletePlan);
router.post("/add-assignment", authenticate, requireAdmin, readingPlanController.addDailyAssignment);
router.post("/add-quiz-questions", authenticate, requireAdmin, readingPlanController.addQuizQuestions);
router.post("/get-all", readingPlanController.getAll);
router.post("/by-category", readingPlanController.getPlansByCategory);
router.post("/start", authenticate, readingPlanController.start);
router.post("/my-progress", authenticate, readingPlanController.myProgress);
router.post("/get-user-plans", authenticate, readingPlanController.getUserPlans);
router.post("/plan-progress", authenticate, readingPlanController.planProgress);
router.post("/daily-assignment", authenticate, readingPlanController.dailyAssignment);
router.post("/all-assignments", authenticate, readingPlanController.allAssignments);
router.post("/complete-day", authenticate, readingPlanController.completeDay);
router.post("/submit-answer", authenticate, readingPlanController.submitAnswer);
router.post("/quiz-questions", authenticate, readingPlanController.quizQuestions);
router.post("/quiz-stats", authenticate, readingPlanController.quizStats);
router.post("/update", authenticate, requireAdmin, readingPlanController.update);
router.post("/update-quiz-question", authenticate, requireAdmin, readingPlanController.updateQuizQuestion);
router.post("/delete-quiz-question", authenticate, requireAdmin, readingPlanController.deleteQuizQuestion);
router.post("/update-assignment", authenticate, requireAdmin, readingPlanController.updateAssignment);
router.post("/plan-detail", readingPlanController.planDetail);
router.post("/remove", authenticate, readingPlanController.remove);

export default router;