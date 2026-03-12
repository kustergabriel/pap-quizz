import mongoose from "mongoose";
import { question, questionSchema } from "../models/questionSchema.js";

class questionController {
    static async getPerguntasSessao(req, res) {
        try {
            const dificuldade = Number(req.query.diff) || 1;
            const perguntasAleatorias = await question.aggregate([
                { $match: { difficult: dificuldade } }, 
                { $sample: { size: 5 } }
            ]);
            if (perguntasAleatorias.length === 0) {
                return res.status(404).json({ 
                    message: `Nenhuma pergunta de dificuldade ${dificuldade} encontrada.` 
                });
            }
            res.status(200).json(perguntasAleatorias);
        } catch (error) {
            console.error("Erro ao buscar perguntas da sessão:", error);
            res.status(500).json({ message: "Erro interno ao buscar perguntas." });
        }
    }

    static async cadastrarPergunta(req, res) {
        try {
            const { title, description, options, correctOption, difficult } = req.body;
            if (!title || !description || !options || !correctOption) {
                return res.status(400).json({ message: "Preencha todos os campos!" });
            }
            const novaPergunta = await question.create({
                title,
                description,
                options, 
                correctOption,
                difficult
            });
            res.status(201).json({ message: "Pergunta salva com sucesso!", id: novaPergunta._id });
        } catch (error) {
            console.error("Erro ao salvar:", error);
            res.status(500).json({ message: "Erro interno ao salvar pergunta." });
        }
    }

    static async getMe(req,res) {
            try {
                const currentUser = await user.findById(req.session.userId)
                if (!currentUser) return res.status(404).json({ message: "Usuário não encontrado" });
                res.status(200).json({
                nickname: currentUser.nickname,
                points: currentUser.points || 0
                });
            } catch (error) {
                res.status(500).json({ message: "Erro ao buscar dados do usuário" });
            }
        }
}

export default questionController