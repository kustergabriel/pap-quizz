import express from "express";
import userController from "../controllers/userController.js";
import rateLimit from 'express-rate-limit';

const router = express.Router()

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Muitas tentativas de login. Aguarde 15 minutos." }
});

const cadastroLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { message: "Muitas tentativas de cadastro. Aguarde 1 hora." }
});

// Rotas de pagina
router.post('/cadastro',cadastroLimiter, userController.createUser)
router.post('/login',loginLimiter, userController.loginUser)

// Rotas de dados
router.get("/api/me", userController.getMe);
router.post("/api/logout", userController.logoutUser)

export default router;