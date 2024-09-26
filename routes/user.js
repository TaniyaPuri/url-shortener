import { Router } from "express";
import { handleUserSignup, handleUserLogin } from "../controllers/user.js";

const router = Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

module.express = router;
