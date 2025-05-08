import express, { Router } from "express";
import * as authController from "../controllers/authControllers";

// Tipagem explícita para o roteador
const router: Router = express.Router();

// Login do usuário
router.post("/login", authController.login);

// Logout do usuário
router.post("/logout", authController.logout);

// Solicitação de esquecimento de senha
router.post("/forgot-password", authController.forgotPassword);

// Redefinição de senha
router.post("/reset-password", authController.resetPassword);

export default router;
