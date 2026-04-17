import * as adminService from "./service.js";
import { formatApiResponse } from "../../utils/helpers.js";

export const getUsersByAdmin = async (req, res) => {
  try {
    const result = await adminService.getUsersByAdmin(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get users by admin error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error fetching users: " + error.message }));
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = await adminService.updateUser(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error updating user: " + error.message }));
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error deleting user: " + error.message }));
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const result = await adminService.toggleUserStatus(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Toggle user status error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error toggling user status: " + error.message }));
  }
};

export const toggleUserVerification = async (req, res) => {
  try {
    const result = await adminService.toggleUserVerification(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Toggle user verification error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error toggling user verification: " + error.message }));
  }
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const result = await adminService.getAdminDashboardStats();
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error fetching dashboard stats: " + error.message }));
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const result = await adminService.getUserActivity(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get user activity error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error fetching user activity: " + error.message }));
  }
};

export const getAllActivity = async (req, res) => {
  try {
    const result = await adminService.getAllActivity(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get all activity error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error fetching activity: " + error.message }));
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const result = await adminService.deleteActivity(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete activity error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error deleting activity: " + error.message }));
  }
};

export const addDailyVerse = async (req, res) => {
  try {
    const result = await adminService.addDailyVerse(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Add daily verse error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error adding daily verse: " + error.message }));
  }
};

export const getAllDailyVerses = async (req, res) => {
  try {
    const result = await adminService.getAllDailyVerses(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get all daily verses error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error fetching daily verses: " + error.message }));
  }
};

export const deleteDailyVerse = async (req, res) => {
  try {
    const result = await adminService.deleteDailyVerse(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete daily verse error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error deleting daily verse: " + error.message }));
  }
};