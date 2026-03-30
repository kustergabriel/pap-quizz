import { QuizSession } from "../models/quizSessionSchema.js";
import User from "../models/userSchema.js";

class QuizSessionController {
    static async startSession(req, res) {
        try {
            const { difficulty } = req.body;
            const newSession = await QuizSession.create({
                userId: req.session.userId,
                difficulty: Number(difficulty) || 1,
                lastQuestionAt: Date.now()
            });
            res.status(201).json({ sessionId: newSession._id });
        } catch (error) {
            res.status(500).json({ message: "Erro ao iniciar sessão" });
        }
    }

    static async updateProgress(req, res) {
        try {
            const { sessionId, isCorrect } = req.body;
            const session = await QuizSession.findById(sessionId);

            if (!session || session.isFinished) return res.status(400).send("Sessão inválida");

            // Validação do Timer de 10 segundos (+2s de margem de rede)
            const tempoPassado = (Date.now() - session.lastQuestionAt) / 1000;
            let acertou = isCorrect;
            if (tempoPassado > 12) {
                acertou = false;
            }

            if (acertou) session.correctAnswers += 1;

            // sem deixar o usuário respondê-la.
            session.currentQuestion += 1;
            session.lastQuestionAt = Date.now();

            if (session.currentQuestion > session.totalQuestions) {
                session.isFinished = true;
                const pontosGanhos = session.correctAnswers * 10;
                await User.findByIdAndUpdate(session.userId, { $inc: { points: pontosGanhos } });
            }

            await session.save();
            res.status(200).json(session);

        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar progresso" });
        }
    }
}

export default QuizSessionController;