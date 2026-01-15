import mongoose from 'mongoose'
import "dotenv/config"; 

async function conctaNaDatabase() {
    console.log("Tentando conectar com a string:", process.env.DB_CONNECTION_STRING);
    mongoose.connect(process.env.DB_CONNECTION_STRING)
    return mongoose.connection
}

export default conctaNaDatabase