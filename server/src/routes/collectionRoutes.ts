import express, { Router } from "express";
const router: Router = express.Router();

import {
    getCollections,
    getCollectionDetails
} from "../controllers/collectionController";
import { authenticateToken } from "../middleware/authMiddleware";

// GET
router.get("/all", getCollections);
router.get("/details/:collectionId", getCollectionDetails);

export default router;