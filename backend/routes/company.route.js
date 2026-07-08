import express from "express";
import { registerCompany, getCompanyById, updateCompany ,getCompany } from "../controllers/company.controller.js";
import isAuthenticated from "../middleware/isAUthenticated.js";

const router = express.Router();

router.route("/registerCompany").post(isAuthenticated, registerCompany);
router.route("/getCompany").get(isAuthenticated, getCompany); 
// router.route("/logout").post(logout); // logout route
router.route("/getCompanyById/:id").get(isAuthenticated, getCompanyById); 
router.route("/updateCompany/:id").put(isAuthenticated, updateCompany);

export default router;

