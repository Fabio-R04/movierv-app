import express, { Router } from "express";
const router: Router = express.Router();

import {
    getSerieDetails,
    getSerieStats,
    likeSerie,
    getSeries,
    favoriteSerie,
    getFavoriteSeries
} from "../controllers/serieController";
import { authenticateToken } from "../middleware/authMiddleware";

// GET
router.get("/serie-details/:serieId", getSerieDetails);
router.get("/serie-stats/:serieId", getSerieStats);
router.get("/series/:page", getSeries);
router.get("/favorite-series", authenticateToken, getFavoriteSeries);

// PUT
router.put("/like/:serieId", authenticateToken, likeSerie);
router.put("/favorite", authenticateToken, favoriteSerie);

export default router;