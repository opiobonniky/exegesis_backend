import express from "express";
import * as bibleController from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-highlight", authenticate, bibleController.addHighlight);
router.post("/get-highlights", authenticate, bibleController.getHighlights);
router.post("/delete-highlight", authenticate, bibleController.deleteHighlight);
router.post("/add-read-history", authenticate, bibleController.addReadHistory);
router.post("/get-read-history", authenticate, bibleController.getReadHistory);
router.post("/delete-read-history", authenticate, bibleController.deleteReadHistory);
router.post("/add-favorite", authenticate, bibleController.addFavorite);
router.post("/get-favorites", authenticate, bibleController.getFavorites);
router.post("/delete-favorite", authenticate, bibleController.deleteFavorite);
router.post("/get-verse-explanation", bibleController.getVerseExplanation);
router.post("/add-verse-explanation", authenticate, bibleController.addVerseExplanation);
router.post("/get-all-verses-explanation", bibleController.getAllVersesExplanation);
router.post("/delete-verse-explanation", authenticate, bibleController.deleteVerseExplanation);
router.post("/add-verse-note", authenticate, bibleController.addVerseNote);
router.post("/get-verse-note", authenticate, bibleController.getVerseNote);
router.post("/delete-verse-note", authenticate, bibleController.deleteVerseNote);
router.post("/get-todys-verse", bibleController.getTodaysVerse);
router.post("/get-home-stats", authenticate, bibleController.getHomeStats);
router.post("/get-recent-activity", authenticate, bibleController.getRecentActivity);
export default router;
