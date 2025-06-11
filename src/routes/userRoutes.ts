import express, { Router } from "express";
import upload from '../middlewares/upload';
import * as userController from "../controllers/userControllers";

// Tipagem explícita para o roteador
const router: Router = express.Router();

// Criar um novo usuário (Admin apenas)
router.post("/register", userController.createUser);

// Obter todos os usuários (Admin apenas)
router.get("/", userController.getAllUsers);

// Obter usuário por ID
router.get("/:id", userController.getUserById);

// Atualizar um usuário
router.put("/:id", userController.updateUser);

// Atualizar recurso específico do usuário
router.patch("/:id", userController.patchUser);

// Deletar um usuário (Admin apenas)
router.delete("/:id", userController.deleteUser);

// Rota para upload de foto de perfil:
router.post('/:id/perfilphoto',upload.single('file'),userController.uploadUserPhoto);

export default router;
