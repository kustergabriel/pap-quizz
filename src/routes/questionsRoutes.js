import express from "express";
import questionController from "../controllers/questionController.js";
import { verificarAdm } from '../middlewares/auth.js';
const routes = express.Router();

// Rotas de pagina
routes.get("/admin/nova-pergunta", verificarAdm, (req, res) => {
    // Verificamos se é ADM antes de entregar a página
    if (req.session.adm === true) {
        res.sendFile(path.join(__dirname, "../views/cadpergunta.html"));
    } else {
        res.status(403).send("Acesso negado.");
    }
});


// Rotas de API
// Pega pergunta aleatoria
routes.get('/api/perguntas/aleatoria', questionController.getPerguntasSessao);

// Cadastrar perguntas novas
routes.post('/api/perguntas', questionController.cadastrarPergunta);

export default routes;