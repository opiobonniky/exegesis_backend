import * as authService from "./service.js";
import { formatApiResponse } from "../../utils/helpers.js";

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Registration error: " + error.message }));
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const result = await authService.verifyAccount(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Verification error: " + error.message }));
  }
};

export const verifyCode = async (req, res) => {
  try {
    const result = await authService.verifyCode(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Verify code error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Verify code error: " + error.message }));
  }
};

export const login = async (req, res) => {
  try {
    const deviceInfo = req.body.deviceInfo || null;
    const result = await authService.login(req.body, deviceInfo);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "An error occurred during login" }));
  }
};

export const googleLogin = async (req, res) => {
  try {
    const deviceInfo = req.body.deviceInfo || null;
    const result = await authService.googleLogin(req.body, deviceInfo);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Google Login error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "An error occurred during Google login" }));
  }
};

export const completeGoogleRegistration = async (req, res) => {
  try {
    const deviceInfo = req.body.deviceInfo || null;
    const result = await authService.completeGoogleRegistration(req.body, deviceInfo);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Complete Google Registration error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "An error occurred during registration" }));
  }
};

export const loginFailed = async (req, res) => {
  try {
    const result = await authService.logFailedLogin(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Login failed logging error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error logging failed login" }));
  }
};

export const refresh = async (req, res) => {
  try {
    const result = await authService.refreshToken(req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Token refresh failed: " + error.message }));
  }
};

export const logout = async (req, res) => {
  try {
    const result = await authService.logout(req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Logout failed: " + error.message }));
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Fetching user details failed: " + error.message }));
  }
};

export const updateCurrentUser = async (req, res) => {
  try {
    const result = await authService.updateCurrentUser(req.user.id, req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Failed to update profile: " + error.message }));
  }
};

export const resendVerification = async (req, res) => {
  try {
    const result = await authService.resendVerification(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Generating new verification code failed: " + error.message }));
  }
};

export const setPassword = async (req, res) => {
  try {
    const result = await authService.setPassword(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Set password error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Password reset failed: " + error.message }));
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Forgot password failed: " + error.message }));
  }
};

export const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Reset password failed: " + error.message }));
  }
};

export const test = (req, res) => {
  return res.status(200).json(formatApiResponse({ status: 200, message: "Server is running", data: "Connection successful" }));
};

export const updatePassword = async (req, res) => {
  try {
    const result = await authService.updatePassword(req.user.id, req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Failed to update password: " + error.message }));
  }
};