import { Router } from "express";
import { uploadVideo } from "../controllers/video.controller";
import { upload } from "../utils/fileUpload";

const router = Router();

router.post("/upload", upload.single("video"), uploadVideo);


export default router;
