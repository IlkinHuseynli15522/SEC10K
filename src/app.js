import express from "express";
import cors from "cors";
import metricsRoutes from "./routes/value.routes.js";
import companies from "./routes/companies.routes.js";
import totalSalesRoutes from "./routes/totalSales.routes.js";
import currentAssetsRoutes from "./routes/currentAssets.routes.js";
import currentLiabilitiesRoutes from "./routes/currentLiabilities.routes.js";
import totalAssetsRoutes from "./routes/totalAssets.routes.js";
import totalEquityRoutes from "./routes/totalEquity.routes.js";
import retainedEarningsRoutes from "./routes/retainedEarnings.routes.js";
import operatingIncomeRoutes from "./routes/operatingIncome.routes.js";

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
app.use("/api", companies);
app.use("/api", metricsRoutes);
app.use("/api", totalSalesRoutes);
app.use("/api", currentAssetsRoutes);
app.use("/api", currentLiabilitiesRoutes);
app.use("/api", totalAssetsRoutes);
app.use("/api", totalEquityRoutes);
app.use("/api", retainedEarningsRoutes);
app.use("/api", operatingIncomeRoutes);

export default app; 