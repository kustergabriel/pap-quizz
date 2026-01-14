import mongoose from "mongoose";
import user from "../models/user.js";


class userController {

    static async createUser (req,res) {
        try {
            console.log("Dados recebidos no Servidor:", req.body);
            const newUser = await user.create(req.body)
            res.status(201).json({ message: `${newUser} criado com sucesso!`, newUser });
        } catch (error) {
            console.error("Erro ao salvar no banco:", error);
            res.status(500).json( { message: `${error.message} - falha na criacao da conta!` } )
        }
    }


    static async loginUser (req, res) {
        try {
            console.log("BACKEND: Login recebido para:", req.body.nickname);
            const { nickname, password } = req.body;
            const findUser = await user.findOne({ nickname: nickname });

            if (!findUser) {
                console.log("BACKEND: Usuário não existe");
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            if (findUser.password !== password) {
                console.log("BACKEND: Senha errada " + findUser.password);
                return res.status(401).json({ message: "Senha incorreta." });
            }

            console.log("BACKEND: Sucesso!");
            res.status(200).json({
                message: "Login realizado com sucesso!",
                user: { id: findUser._id, nickname: findUser.nickname }
            });
        } catch (error) { // Mudei para 'error'
            console.error("BACKEND ERROR:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    }
}

export default userController





