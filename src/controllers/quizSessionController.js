import mongoose from "mongoose";
import { QuizSession } from "../models/quizSessionSchema.js";
import { selectFields } from "express-validator/lib/field-selection.js";

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

            if (session.isFinished) return res.status(400).json({ message: "Sessão já finalizada" });

            if (isCorrect) {
                session.correctAnswers += 1;
            }

            session.currentQuestion += 1;

            if (session.currentQuestion > session.totalQuestions) {
                session.isFinished = true;
                
                await User.findByIdAndUpdate(
                session.userId, 
                { $inc: { points: pontosGanhos } } // $inc soma ao valor atual sem precisar ler antes
            );
            
            }

            await session.save();
            res.status(200).json(session);
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar progresso" });
        }
    }
}

export default QuizSessionController