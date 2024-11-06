import express from "express";
import { listCartera } from "../controllers/cartera.js";

const router = express.Router();

router.get("/", listCartera);

export default router;