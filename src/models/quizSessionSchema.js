import mongoose from "mongoose";

const quizSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    currentQuestion: { type: Number, default: 1 },
    totalQuestions: { type: Number, default: 5 },
    correctAnswers: { type: Number, default: 0 },
    isFinished: { type: Boolean, default: false },
    lastQuestionAt: { type: Date, default: Date.now }, // Para o Timer de 10s
    difficulty: { type: Number, default: 1 }
}, { timestamps: true });

export const QuizSession = mongoose.model("QuizSession", quizSessionSchema);