import mongoose from "mongoose";
import user from "../models/user.js";

class userController {

    static async createUser (req,res) {
        try {
            console.log("Dados recebidos no Servidor:", req.body);
            
            // Verificar se ja existe esse email ou nickname do db
            const { email, nickname, cpf } = req.body
            
            const userInDb = await user.findOne ({
                $or: [{email:email}, {nickname:nickname}, {cpf:cpf}]
            })

            if (userInDb) {
                let msg = "Dados ja cadastrados"

                if (userInDb.email === email) msg = "Este e-mail já está em uso.";
                if (userInDb.nickname === nickname) msg = "Este nome de usuário já está em uso.";
                if (userInDb.cpf === cpf) msg = "Este CPF já possui uma conta.";
                
                return res.status(400).json({ message: msg })
            }
            
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





