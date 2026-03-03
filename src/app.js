import express from 'express'
import csrf from 'csurf';
import routes from '../src/routes/index.js'; 
import path from 'path';
import conctaNaDatabase from '../back-end/config/dbconnect.js'
import { fileURLToPath } from 'url';
import session from "express-session";
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

const conexao = await conctaNaDatabase()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const csrfProtection = csrf({ cookie: true });

conexao.on('error', (erro)=> {
    console.error("erro de conexao ", erro);
})

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { message: "Muitas requisições deste IP. Tente novamente mais tarde." }
});

app.use(session({
    secret: process.env.SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { 
    secure: process.env.SECURE === 'production',
    httpOnly: true,
    sameSite: 'strict'
            }
}));

app.use(cookieParser());
app.use(globalLimiter); 
app.use(express.json());
app.use(csrfProtection);
app.use(express.static(path.join(__dirname, '../public')));

routes(app);

export default app
