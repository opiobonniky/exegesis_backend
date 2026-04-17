import * as bibleService from "./service.js";
import { formatApiResponse } from "../../utils/helpers.js";

export const addHighlight = async (req, res) => {
  try {
    const result = await bibleService.addHighlight(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Add highlight error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error adding highlight: " + error.message }));
  }
};

export const getHighlights = async (req, res) => {
  try {
    const result = await bibleService.getHighlights(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get highlights error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error getting highlights: " + error.message }));
  }
};

export const deleteHighlight = async (req, res) => {
  try {
    const result = await bibleService.deleteHighlight(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete highlight error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error deleting highlight: " + error.message }));
  }
};

export const addReadHistory = async (req, res) => {
  try {
    const result = await bibleService.addReadHistory(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Add read history error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error adding read history: " + error.message }));
  }
};

export const getReadHistory = async (req, res) => {
  try {
    const result = await bibleService.getReadHistory(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get read history error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error getting read history: " + error.message }));
  }
};

export const deleteReadHistory = async (req, res) => {
  try {
    const result = await bibleService.deleteReadHistory(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete read history error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error deleting read history: " + error.message }));
  }
};

export const addFavorite = async (req, res) => {
  try {
    const result = await bibleService.addFavorite(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Add favorite error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error adding favorite: " + error.message }));
  }
};

export const getFavorites = async (req, res) => {
  try {
    const result = await bibleService.getFavorites(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get favorites error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error getting favorites: " + error.message }));
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const result = await bibleService.deleteFavorite(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete favorite error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error deleting favorite: " + error.message }));
  }
};

export const getVerseExplanation = async (req, res) => {
  try {
    const result = await bibleService.getVerseExplanation(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get verse explanation error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error getting verse explanation: " + error.message }));
  }
};

export const addVerseExplanation = async (req, res) => {
  try {
    const result = await bibleService.addVerseExplanation(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Add verse explanation error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error adding verse explanation: " + error.message }));
  }
};

export const getAllVersesExplanation = async (req, res) => {
  try {
    const result = await bibleService.getAllVersesExplanation(req.body);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get all verse explanations error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error getting verse explanations: " + error.message }));
  }
};

export const addVerseNote = async (req, res) => {
  try {
    const result = await bibleService.addVerseNote(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Add verse note error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error adding verse note: " + error.message }));
  }
};

export const getVerseNote = async (req, res) => {
  try {
    const result = await bibleService.getVerseNote(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get verse note error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error getting verse note: " + error.message }));
  }
};

export const deleteVerseNote = async (req, res) => {
  try {
    const result = await bibleService.deleteVerseNote(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete verse note error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error deleting verse note: " + error.message }));
  }
};

export const getTodaysVerse = async (req, res) => {
  try {
    const result = await bibleService.getTodaysVerse();
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get today's verse error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error getting today's verse: " + error.message }));
  }
};

export const getHomeStats = async (req, res) => {
  try {
    const result = await bibleService.getHomeStats(req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Get home stats error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error getting home stats: " + error.message }));
  }
};

export const deleteVerseExplanation = async (req, res) => {
  try {
    const result = await bibleService.deleteVerseExplanation(req.body, req.user.id);
    return res.status(result.status).json(formatApiResponse(result));
  } catch (error) {
    console.error("Delete verse explanation error:", error);
    return res.status(500).json(formatApiResponse({ status: 500, message: "Error deleting verse explanation: " + error.message }));
  }
};