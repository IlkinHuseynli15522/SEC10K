import { Router } from "express";
import { getData } from "../controllers/currentAssets.controller.js";

const router = Router()

router.get('/currentAssets', getData)

export default router