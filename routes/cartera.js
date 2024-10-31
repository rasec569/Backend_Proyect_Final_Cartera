import express from "express";
import { getCartera } from "../controllers/carteraController.js";

const router = express.Router();

router.get("/", getCartera);

export default router;