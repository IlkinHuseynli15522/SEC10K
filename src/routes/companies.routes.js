import { Router } from "express";
import { getCompanies } from "../controllers/companies.controllers.js";

const router = Router()

router.get('/companies', getCompanies)

export default router