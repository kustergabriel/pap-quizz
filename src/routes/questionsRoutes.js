import express from "express";
import questionController from "../controllers/questionController.js";

const routes = express.Router();

function verificarAdm(req, res, next) {
    if (req.session.userId && req.session.adm === true) {
        return next();
    }
    res.status(403).json({ message: "Acesso negado. Apenas administradores podem fazer isso." });
}

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
routes.get('/api/perguntas/aleatoria', questionController.getPergunta);

// Apenas ADM pode cadastrar perguntas novas
routes.post('/api/perguntas', questionController.cadastrarPergunta);

export default routes;