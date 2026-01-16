import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router()


// Rotas de pagina
router.post('/cadastro', userController.createUser)
router.post('/login', userController.loginUser)

// Rotas de dados
router.get("/api/me", userController.getMe);

export default router;