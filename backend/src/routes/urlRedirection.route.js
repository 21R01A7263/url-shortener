import express from "express";
import analytics from "../middleware/analytics.js";
import { redirectUrl } from "../controllers/urlRedirection.controller.js";

const router = express.Router();

router.get("/:shortId", analytics, redirectUrl);

export default router;