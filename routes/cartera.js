import express from "express";
import { getCartera } from "../controllers/cartera.js";

const router = express.Router();

router.get("/", getCartera);

export default router;