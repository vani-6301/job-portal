import express from "express";
import { applyJob, getApplications, getApplicationsByJobId ,updateApplicationStatus, } from "../controllers/application.controller.js";
import isAuthenticated from "../middleware/isAUthenticated.js";

const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getApplications);
router.route("/:id/applicants").get(isAuthenticated, getApplicationsByJobId);
router.route("/status/:id/update").put(isAuthenticated, updateApplicationStatus);

export default router;

