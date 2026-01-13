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
}

export default userController





