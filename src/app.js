import express from 'express'


const conexao = await conctaNaDatabase()

conexao.on('error', (erro)=> {
    console.error("erro de conexao ", erro)
})

const app = express()
routes(app)

export default app
