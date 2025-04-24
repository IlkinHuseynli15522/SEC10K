import { Router } from "express";
import { getData } from "../controllers/totalAssets.controller.js";

const router = Router()

router.get('/totalAssets', getData)

export default router