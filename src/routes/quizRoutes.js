import express from "express";
import QuizSessionController from "../controllers/quizSessionController.js";
import { verificarAutenticacao } from '../middlewares/auth.js';
import questionController from "../controllers/questionController.js";

const routes = express.Router();

// Rotas de API

// Inicia uma nova rodada de 5 perguntas
routes.post("/api/quiz/start", verificarAutenticacao, QuizSessionController.startSession);

// Atualiza o progresso a cada resposta
routes.post("/api/quiz/update", verificarAutenticacao, QuizSessionController.updateProgress);

// Pega 5 perguntas da dificuldade escolhida
routes.get("/api/perguntas/sessao", verificarAutenticacao, questionController.getPerguntasSessao);

export default routes;