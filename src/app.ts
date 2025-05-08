// app.ts
import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import evidenceRoutes from "./routes/evidenceRoutes";
import reportRoutes from "./routes/reportRoutes";
import caseRoutes from "./routes/caseRoutes";
import router from "./routes/authRoutes";
// import imageEvidenceRoutes from './src/routes/imageEvidenceRoutes';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/evidences", evidenceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/cases", caseRoutes);
// app.use('/api/upload', imageEvidenceRoutes);

export default app;
