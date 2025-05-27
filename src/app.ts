// app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "dotenv/config";
import errorHandler from "./middlewares/errorHandler"; // se tiver

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import evidenceRoutes from "./routes/evidenceRoutes";
import reportRoutes from "./routes/reportRoutes";
import caseRoutes from "./routes/caseRoutes";
import victimRoutes from "./routes/victimRoutes";
import router from "./routes/authRoutes";   
import dashboard from './routes/dashBoardRoutes'
// import imageEvidenceRoutes from './src/routes/imageEvidenceRoutes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/evidences", evidenceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/victims", victimRoutes);
app.use("/api/dashboard", dashboard);
// app.use('/api/upload', imageEvidenceRoutes);

app.use(errorHandler);

export default app;
