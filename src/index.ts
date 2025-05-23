import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
const PORT = process.env.PORT || 4040;
import videoRoutes from "./routes/video.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/api/videos", videoRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
