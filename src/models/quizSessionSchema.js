import mongoose from "mongoose";

const quizSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    difficulty: { type: Number, enum: [1, 2, 3], default: 1 }, // 1:Fácil, 2:Médio, 3:Difícil
    correctAnswers: { type: Number, default: 0 },
    currentQuestion: { type: Number, default: 1 },
    totalQuestions: { type: Number, default: 5 },
    isFinished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false } )

export const QuizSession = mongoose.model('sessions', quizSessionSchema);
