import { Router } from "express";
import { getData } from "../controllers/totalEquity.controllers.js";

const router = Router()

router.get('/totalEquity', getData)

export default router