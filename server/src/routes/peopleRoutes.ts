import express, { Router } from "express";
const router: Router = express.Router();

import {
    getPeople,
    getPersonDetails
} from '../controllers/peopleController';
import { authenticateToken } from "../middleware/authMiddleware";

// GET
router.get("/all/:page", getPeople);
router.get("/details/:personId", getPersonDetails);

export default router;