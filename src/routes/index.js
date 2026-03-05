import express from 'express'
import userRoutes from './userRoutes.js'
import questionsRoutes from './questionsRoutes.js'
import User from '../models/userSchema.js';
import path from 'path';
import userController from '../controllers/userController.js';
import { verificarAutenticacao } from '../middlewares/auth.js';
import { fileURLToPath } from 'url';
import quizRoutes from "./quizRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = (app) => {
    app.use(express.json());

    // Rota Raiz ****DESENVOLVER****
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, ""));
    });

    // Rota do quiz mesmo
    app.get("/quiz", (req,res) => {
        res.sendFile(path.join(__dirname, "../views/perguntas.html"));
    });

    // Rota de cadastro
    app.get("/cadastro", (req,res) => {
        res.sendFile(path.join(__dirname, "../views/cadusuario.html"));
    });

    // Rota de login
    app.get("/login", (req,res) => {
        res.sendFile(path.join(__dirname, "../views/cadastrologin.html"));
    });
     

    // Rota de home
    app.get("/home", verificarAutenticacao, async (req,res) => {
        try {
        // Buscamos o usuário no banco para garantir que temos o status de ADM 
        const usuario = await User.findById(req.session.userId);
        if (usuario && usuario.adm === true) {
            // Se for ADM, envia a página com o botão extra
            res.sendFile(path.join(__dirname, "../views/homepageadm.html"));
        } else {
            // Se for comum, envia a página padrão
            res.sendFile(path.join(__dirname, "../views/homepageusr.html"));
        }

    } catch (error) {
        res.status(500).send("Erro ao carregar a página inicial.");
    }
    });
    
    // Rotas de API que devolvem algo do servidor

    app.use(userRoutes);
    app.use(questionsRoutes);
    app.use(quizRoutes);
    
    app.get('/api/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Não autorizado" });
    }
    userController.getMe(req, res);
    });

}

export default routes