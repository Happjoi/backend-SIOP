import express, { Router } from "express";
import * as authController from "../controllers/authControllers";

// Tipagem explícita para o roteador
const router: Router = express.Router();

// Login do usuário
router.post("/login", authController.login);

// Logout do usuário
router.post("/logout", authController.logout);

// Esqueceu a senha → recebe { email }
router.post('/forgot-password', authController.forgotPasswordEmail);


export default router;
