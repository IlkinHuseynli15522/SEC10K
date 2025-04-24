import { Router } from "express";
import { getData } from "../controllers/retainedEarnings.controllers.js";

const router = Router()

router.get('/retainedEarnings', getData)

export default router