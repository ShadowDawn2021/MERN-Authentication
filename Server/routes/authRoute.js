import express from "express";
import { logIn, logout, register } from "../controllers/authControler.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", logIn);
router.post("/logout", logout);

export default router;
