import mongoose from "mongoose";
import { question, questionSchema } from "../models/questionSchema.js";


class questionController {
    static async getPergunta (req,res) {
        try {
            const perguntaAleatoria = await question.aggregate([
                // { $match: { difficult: 1 } }, Depois para filtrar perguntas de dificuldade diferentes
                { $sample: { size: 1 } }
            ])

            if (perguntaAleatoria.length === 0) {
                return res.status(404).json({ message: "Nenhuma pergunta encontrada." })
            }

            // Retornamos apenas o objeto da pergunta (índice 0 do array)
            res.status(200).json(perguntaAleatoria[0]);
        }   
            catch (error) {
            console.error("Erro ao buscar pergunta:", error);
            res.status(500).json({ message: "Erro interno ao buscar pergunta." });
        }
    }

    static async cadastrarPergunta(req, res) {
        try {
            const { title, description, options, correctOption, difficult } = req.body;

            // Validação simples
            if (!title || !description || !options || !correctOption) {
                return res.status(400).json({ message: "Preencha todos os campos!" });
            }

            // Criando no banco
            const novaPergunta = await question.create({
                title,
                description,
                options, // Se você enviar como Array do front, o Mongoose aceita direto
                correctOption,
                difficult
            });

            res.status(201).json({ message: "Pergunta salva com sucesso!", id: novaPergunta._id });
        } catch (error) {
            console.error("Erro ao salvar:", error);
            res.status(500).json({ message: "Erro interno ao salvar pergunta." });
        }
    }

}

export default questionController