import express from "express";
import { getMetrics } from "../controllers/value.controllers.js";

const router = express.Router();

// Route: Get metrics
router.get("/filter", getMetrics);

export default router;