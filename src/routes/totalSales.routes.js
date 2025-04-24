import { Router } from "express";
import { getData } from "../controllers/totalSales.controllers.js";

const router = Router()

router.get('/totalSales', getData)

export default router