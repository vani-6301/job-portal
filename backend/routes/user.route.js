import express from "express";
import { login, register, updateProfile ,logout } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAUthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login); 
// router.route("/logout").post(logout); // logout route
router.route("/logout").get(logout); // logout route
router.route("/profile/update").put(isAuthenticated, updateProfile);

export default router;

