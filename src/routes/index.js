import express from 'express'
import user from './userRoutes.js'
import questions from './questionsRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function verificarAutenticacao(req, res, next) {
    if (req.session.userId) {
        return next(); // Está logado, pode prosseguir
    }
    res.redirect('/login'); // Não está logado, vai para o login
}

const routes = (app) => {
    // Rota Raiz ****DESENVOLVER****
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, ""));
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
    app.get("/home", verificarAutenticacao, (req,res) => {
        res.sendFile(path.join(__dirname, "../views/homepageusr.html"));
    });
    
    // Rota de API
    app.use(express.json(), user, questions)

    app.get('/api/me', (req, res) => {
    if (!req.session.userId) {
        // Importante: Em rotas de API, retorne JSON de erro, não redirecione para HTML!
        return res.status(401).json({ message: "Não autorizado" });
    }
    
    // Se estiver logado, chama o controller
    userController.getMe(req, res);
    });

}

export default routes