import { Router } from "express";
import { getData } from "../controllers/operatingIncome.controllers.js";

const router = Router()

router.get('/operatingIncome', getData)

export default router