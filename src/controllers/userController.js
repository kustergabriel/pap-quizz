import mongoose from "mongoose";
import user from "../models/user.js";
import bcrypt from 'bcrypt';

class userController {

    static async createUser (req,res) {
        try {
            console.log("Dados recebidos no Servidor:", req.body);
            
            // Verificar se ja existe esse email ou nickname do db
            const { name, email, nickname, cpf, password } = req.body
            
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

            const salt = await bcrypt.genSalt(10); // Gera a complexidade
            const hashedPassword = await bcrypt.hash(password, salt); // Transforma a senha em código

            const newUser = await user.create({
            name,
            nickname,
            email,
            cpf,
            password: hashedPassword // Salva o HASH, não a senha do usuario
        });

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
            const senhaCorreta = await bcrypt.compare(password, findUser.password);

            if (!senhaCorreta) {
                console.log("BACKEND: Tentativa de senha inválida");
                return res.status(401).json({ message: "Senha incorreta." });
            }

            req.session.userId = findUser._id;
            req.session.nickname = findUser.nickname;
            req.session.adm = findUser.adm;

            console.log("Sessão criada para:", req.session.nickname);
            res.status(200).json({ message: "Login realizado!", adm: findUser.adm });
            
            
        } catch (error) { 
            console.error("BACKEND ERROR:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
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

    static logoutUser (req,res) {
        req.session.destroy((err) => { 
        if (err) {
            return res.status(500).json({ message: "Erro ao encerrar sessão." });
        }
        res.clearCookie('connect.sid'); // Limpa o cookie do navegador (nome padrão do express-session)
        res.status(200).json({ message: "Logout realizado com sucesso!" });
    });
    }




}

export default userController





