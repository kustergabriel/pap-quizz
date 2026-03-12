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
            return res.status(400).json({ message: "Sessão inválida" });
        }

        const agora = Date.now();
        const tempoPassado = (agora - session.lastQuestionAt) / 1000; // Converte ms para segundos

        let respostaValida = isCorrect;
        
        // Se demorou mais de 12 segundos 10s do timer + 2 de garantia
        if (tempoPassado > 12) {
            console.log(`Resposta ignorada: Usuário demorou ${tempoPassado}s`);
            respostaValida = false; // Força o erro porque estourou o tempo
        }
        if (respostaValida) {
            session.correctAnswers += 1;
        }
        if (session.currentQuestion >= session.totalQuestions) {
            session.isFinished = true;
            const pontosGanhos = session.correctAnswers * 10;

            await User.findByIdAndUpdate(
                session.userId, 
                { $inc: { points: pontosGanhos } }
            );
        } else {
            session.currentQuestion += 1;
            session.lastQuestionAt = Date.now();
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