import mongoose from "mongoose";
import { QuizSession } from "../models/quizSessionSchema.js";
import { selectFields } from "express-validator/lib/field-selection.js";
import User from "../models/userSchema.js";

class QuizSessionController {
    // Inicia uma sessao do quiz
    static async startSession(req, res) {
        try {
            const { difficulty } = req.body;
            const newSession = await QuizSession.create({
                userId: req.session.userId,
                difficulty: difficulty || 1
            });
            res.status(201).json({ sessionId: newSession._id });
        } catch (error) {
            res.status(500).json({ message: "Erro ao iniciar sessão" });
        }
    }

    // Verifica o progresso do quiz
    static async updateProgress(req, res) {
    try {
        const { sessionId, isCorrect } = req.body;
        const session = await QuizSession.findById(sessionId);

        if (!session || session.isFinished) {
            return res.status(400).json({ message: "Sessão já finalizada ou inválida" });
        }

        // 1. Processa o acerto da pergunta ATUAL
        if (isCorrect) session.correctAnswers += 1;

        console.log(`Processando resposta da pergunta: ${session.currentQuestion} de ${session.totalQuestions}`);

        // 2. CHECAGEM DE FINALIZAÇÃO
        // Se a pergunta que acabei de responder era a última (ex: 5 de 5)
        if (session.currentQuestion >= session.totalQuestions) {
            console.log("--- FIM DO QUIZ DETECTADO ---");
            session.isFinished = true;

            const pontosGanhos = session.correctAnswers * 10;
            
            await User.findByIdAndUpdate(
                session.userId, 
                { $inc: { points: pontosGanhos } }
            );
            
            console.log(`Pontos computados: ${pontosGanhos}`);
        } else {
            // 3. Só incrementa para a PRÓXIMA se ainda não era a última
            session.currentQuestion += 1;
        }

        await session.save();
        res.status(200).json(session);
    } catch (error) {
        console.error("ERRO:", error);
        res.status(500).send("Erro interno");
    }
}
}

export default QuizSessionController