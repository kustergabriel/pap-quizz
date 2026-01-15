import express from 'express'
import user from './userRoutes.js'
import questions from './questionsRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    app.get("/home", (req,res) => {
        res.sendFile(path.join(__dirname, "../views/homepageusr.html"));
    });
    
    // Rota de API
    app.use(express.json(), user, questions)

}

export default routes