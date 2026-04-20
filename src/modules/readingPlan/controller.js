import * as readingPlanService from "./service.js";
import { formatApiResponse } from "../../utils/helpers.js";

export const create = async (req, res) => {
  try {
    const result = await readingPlanService.createReadingPlan(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Create reading plan error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error creating reading plan: " + error.message,
      }),
    );
  }
};

export const deletePlan = async (req, res) => {
  try {
    const result = await readingPlanService.deleteReadingPlan(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete reading plan error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error deleting reading plan: " + error.message,
      }),
    );
  }
};

export const addDailyAssignment = async (req, res) => {
  try {
    const result = await readingPlanService.addDailyAssignment(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Add assignment error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error adding daily assignment: " + error.message,
      }),
    );
  }
};

export const addQuizQuestions = async (req, res) => {
  try {
    const result = await readingPlanService.addQuizQuestions(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Add quiz questions error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error adding quiz questions: " + error.message,
      }),
    );
  }
};

export const getAll = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const result = await readingPlanService.getAllReadingPlans(
      req.body,
      userId,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get all reading plans error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving reading plans: " + error.message,
      }),
    );
  }
};

export const getPlansByCategory = async (req, res) => {
  try {
    const result = await readingPlanService.getPlansByCategory(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get plans by category error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving reading plans by category: " + error.message,
      }),
    );
  }
};

export const start = async (req, res) => {
  try {
    const result = await readingPlanService.startReadingPlan(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Start reading plan error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error starting reading plan: " + error.message,
      }),
    );
  }
};

export const myProgress = async (req, res) => {
  try {
    const result = await readingPlanService.getUserProgress(req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get user progress error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving user progress: " + error.message,
      }),
    );
  }
};

export const getUserPlans = async (req, res) => {
  try {
    const result = await readingPlanService.getUserPlans(req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get user plans error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving user plans: " + error.message,
      }),
    );
  }
};

export const planProgress = async (req, res) => {
  try {
    const result = await readingPlanService.getUserPlanProgress(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get plan progress error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving user plan progress: " + error.message,
      }),
    );
  }
};

export const dailyAssignment = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const result = await readingPlanService.getDailyAssignment(
      req.body,
      userId,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get daily assignment error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving daily assignment: " + error.message,
      }),
    );
  }
};

export const allAssignments = async (req, res) => {
  try {
    const result = await readingPlanService.getAllDailyAssignments(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get all assignments error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving all daily assignments: " + error.message,
      }),
    );
  }
};

export const completeDay = async (req, res) => {
  try {
    const result = await readingPlanService.markDayCompleted(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Complete day error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error marking day as completed: " + error.message,
      }),
    );
  }
};

export const submitAnswer = async (req, res) => {
  try {
    console.log("📨 Controller received body:", JSON.stringify(req.body));
    const result = await readingPlanService.submitQuizAnswer(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Submit answer error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error submitting quiz answer: " + error.message,
      }),
    );
  }
};

export const quizQuestions = async (req, res) => {
  try {
    const result = await readingPlanService.getQuizQuestions(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get quiz questions error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving quiz questions: " + error.message,
      }),
    );
  }
};

export const quizStats = async (req, res) => {
  try {
    const result = await readingPlanService.getQuizStatistics(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get quiz stats error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving quiz statistics: " + error.message,
      }),
    );
  }
};

export const update = async (req, res) => {
  try {
    const result = await readingPlanService.updateReadingPlan(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Update reading plan error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error updating reading plan: " + error.message,
      }),
    );
  }
};

export const updateQuizQuestion = async (req, res) => {
  try {
    const result = await readingPlanService.updateQuizQuestion(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Update quiz question error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error updating quiz question: " + error.message,
      }),
    );
  }
};

export const deleteQuizQuestion = async (req, res) => {
  try {
    const result = await readingPlanService.deleteQuizQuestion(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete quiz question error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error deleting quiz question: " + error.message,
      }),
    );
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const result = await readingPlanService.updateDailyAssignment(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Update assignment error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error updating daily assignment: " + error.message,
      }),
    );
  }
};

export const planDetail = async (req, res) => {
  try {
    const userId = req.user?.id ?? null;
    const result = await readingPlanService.getPlanDetail(req.body, userId);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get plan detail error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving plan detail: " + error.message,
      }),
    );
  }
};

export const remove = async (req, res) => {
  try {
    const result = await readingPlanService.removeReadingPlan(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Remove reading plan error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error removing reading plan: " + error.message,
      }),
    );
  }
};

export const dayQuizAnswers = async (req, res) => {
  try {
    const result = await readingPlanService.getDayQuizAnswers(
      req.body,
      req.user.id,
    );
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get day quiz answers error:", error);
    return res.status(500).json(
      formatApiResponse({
        status: 500,
        message: "Error retrieving day quiz answers: " + error.message,
      }),
    );
  }
};
