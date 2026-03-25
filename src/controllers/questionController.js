import mongoose from "mongoose";
import { question, questionSchema } from "../models/questionSchema.js";


class questionController {
    static async getPergunta (req, res) {
        try {
            const { difficulty } = req.query;
            const valorDificuldade = Number(difficulty);

            // ✅ CORREÇÃO: busca tanto por Number quanto por String
            // para cobrir perguntas salvas com tipo inconsistente no banco
            const filtro = !isNaN(valorDificuldade) && difficulty !== undefined
                ? { $or: [
                    { difficult: valorDificuldade },
                    { difficult: String(valorDificuldade) }
                  ]}
                : {};

            console.log("Buscando com filtro:", filtro);

            const perguntaAleatoria = await question.aggregate([
                { $match: filtro },
                { $sample: { size: 1 } }
            ]);

            if (perguntaAleatoria.length === 0) {
                console.log("Nenhuma pergunta encontrada para o filtro:", filtro);
                return res.status(404).json({ message: "Nenhuma pergunta encontrada." });
            }

            res.status(200).json(perguntaAleatoria[0]);
        } catch (error) {
            console.error("Erro ao buscar pergunta:", error);
            res.status(500).json({ message: "Erro interno ao buscar pergunta." });
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
                difficult: Number(difficult) 
            });

            res.status(201).json({ message: "Pergunta salva com sucesso!", id: novaPergunta._id });
        } catch (error) {
            console.error("Erro ao salvar:", error);
            res.status(500).json({ message: "Erro interno ao salvar pergunta." });
        }
    }
}

export default questionController;