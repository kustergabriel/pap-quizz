import express from 'express'
import routes from '../src/routes/index.js'; 
import path from 'path';
import conctaNaDatabase from '../back-end/config/dbconnect.js'
import { fileURLToPath } from 'url';
import session from "express-session";

const conexao = await conctaNaDatabase()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

conexao.on('error', (erro)=> {
    console.error("erro de conexao ", erro);
})

app.use(session({
    secret: "ASUIDYASHUIDSAIDY17283612HDJKSDUY8126372HDSAI", // Use uma string aleatória
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Em produção com HTTPS, use true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

routes(app);

export default app
