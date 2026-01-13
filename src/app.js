import express from 'express'
import routes from '../src/routes/index.js'; 
import path from 'path';
import conctaNaDatabase from '../back-end/config/dbconnect.js'
import { fileURLToPath } from 'url';

const conexao = await conctaNaDatabase()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

conexao.on('error', (erro)=> {
    console.error("erro de conexao ", erro);
})

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

routes(app);

export default app
