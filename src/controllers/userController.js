import mongoose from "mongoose";
import user from "../models/user.js";
import bcrypt from 'bcrypt';

class userController {

    static async createUser (req,res) {
        try {
            console.log("Dados recebidos no Servidor:", req.body);
            
            // Verificar se ja existe esse email ou nickname do db
            const { name, email, nickname, cpf, password } = req.body
            
            // Validar se todos os campos foram preenchidos
            if (!name || !email || !nickname || !cpf || !password) {
                return res.status(400).json({ 
                    message: "Todos os campos são obrigatórios." 
                });
            }

            // Tipo de dados
            if (typeof name !== 'string' || typeof email !== 'string' || 
                typeof nickname !== 'string' || typeof cpf !== 'string' || 
                typeof password !== 'string') {
                return res.status(400).json({ 
                    message: "Tipo de dados inválido." 
                });
            }

            // Nome não pode ter números    
            const nameTrimmed = name.trim();
        
            const nomeRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Aceita letras e espaços (com acentos)
            if (!nomeRegex.test(nameTrimmed)) {
                return res.status(400).json({ 
                    message: "Nome deve conter apenas letras." 
                });
            }

            // Tamanho mínimo para a senha
            if (password.length < 8) {
                return res.status(400).json({ 
                    message: "Senha deve ter no mínimo 8 caracteres." 
                });
            }

            const salt = await bcrypt.genSalt(12); // Gera a complexidade
            const hashedPassword = await bcrypt.hash(password, salt); // Transforma a senha em código

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

            const newUser = await user.create({
            name,
            nickname,
            email,
            cpf,
            password: hashedPassword // Salva o HASH, não a senha do usuario
        });

            res.status(201).json({ 
                message: "Conta criada com sucesso!", 
                user: { 
                    id: newUser._id,
                    nickname: newUser.nickname, 
                    email: newUser.email 
                } 
            });

        } catch (error) {
            console.error("Erro ao salvar no banco:", error);
            res.status(500).json( { message: `${error.message} - falha na criacao da conta!` } )
        }
    }


    static async loginUser (req, res) {
        try {
            console.log("BACKEND: Login recebido para:", req.body.nickname);
            const { nickname, password } = req.body;

            if (!nickname || !password) {
                return res.status(400).json({ 
                    message: "Nome de usuário e senha são obrigatórios." 
                });
            }

            if (typeof nickname !== 'string' || typeof password !== 'string') {
                return res.status(400).json({ 
                    message: "Dados inválidos." 
                });
            }

            const findUser = await user.findOne({ nickname: nickname });

            if (!findUser) {
                // Delay para dificultar brute force
                await new Promise(resolve => setTimeout(resolve, 1000));
                // MENSAGEM GENÉRICA (não revela se usuário existe)
                return res.status(401).json({ 
                    message: "Usuário ou senha incorretos." 
                });
            }
            const senhaCorreta = await bcrypt.compare(password, findUser.password);

            if (!senhaCorreta) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return res.status(401).json({ 
                    message: "Usuário ou senha incorretos." 
                });
            }

            // Criar sessao
            req.session.userId = findUser._id;
            req.session.nickname = findUser.nickname;
            req.session.adm = findUser.adm;

            console.log("Sessão criada para:", req.session.nickname);
            res.status(200).json({ 
                message: "Login realizado com sucesso!", 
                user: {
                    nickname: findUser.nickname,
                    adm: findUser.adm,
                    points: findUser.points || 0
                }
            });
            
            
        } catch (error) { 
            console.error("BACKEND ERROR:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    static async getMe(req,res) {
        try {
            // Validar se existe uma sessao 
            if (!req.session || !req.session.userId) {
                return res.status(401).json({ 
                    message: "Não autenticado." 
                });
            }

            // Validar se userId é um ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(req.session.userId)) {
                return res.status(400).json({ 
                    message: "ID de usuário inválido." 
                });
            }

            const currentUser = await user.findById(req.session.userId)

            if (!currentUser) {
                // Sessão existe mas usuário foi deletado
                req.session.destroy();
                return res.status(404).json({ 
                    message: "Usuário não encontrado." 
                });
            }

            res.status(200).json({
            nickname: currentUser.nickname,
            points: currentUser.points || 0
            });

        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar dados do usuário" });
        }
    }

    static logoutUser (req,res) {
        
        if (!req.session) {
            return res.status(400).json({ 
                message: "Nenhuma sessão ativa." 
            });
        }

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





