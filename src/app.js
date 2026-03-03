import express from 'express'
import routes from '../src/routes/index.js'; 
import path from 'path';
import conctaNaDatabase from '../back-end/config/dbconnect.js'
import { fileURLToPath } from 'url';
import session from "express-session";
import helmet from 'helmet';
import 'dotenv/config';

const conexao = await conctaNaDatabase()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

conexao.on('error', (erro)=> {
    console.error("erro de conexao ", erro);
})

app.use(helmet());


app.use(session({
    secret: process.env.SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true, // Impede que scripts JS acessem o cookie (Proteção XSS)
        sameSite: 'lax', // Proteção básica contra CSRF
        maxAge: 1000 * 60 * 60 * 24 // 1 dia de duração
    }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

routes(app);

export default app
