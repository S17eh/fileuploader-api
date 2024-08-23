import express from "express";
import { uploadFile } from "../controllers/uploadController.js";
import { confirmUpload } from "../controllers/confirmationController.js";

const router = express.Router();

router.post("/upload", uploadFile);
router.post("/confirm", confirmUpload);

export default router;
