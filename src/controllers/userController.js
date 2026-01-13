import mongoose from "mongoose";
import user from "../models/user.js";


class userController {

    static async createUser (req,res) {
        
        
    }
}

export default userController





// try {
        //     const newUser = await user.create(req.body)
        //     res.status(201).json({ message: `${newUser} criado com sucesso!`, livro: novoAutor });
        // } catch (error) {
        //     res.status(500).json( { message: `${error.message} - falha na criacao da conta!` } )
        // }