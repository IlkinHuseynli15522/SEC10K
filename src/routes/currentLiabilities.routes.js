import { Router } from "express";
import { getData } from "../controllers/currentLiabilities.controllers.js";

const router = Router()

router.get('/currentLiabilities', getData)

export default router