import mongoose from 'mongoose'

async function conctaNaDatabase() {
    mongoose.connect(process.env.DB_CONNECTION_STRING)
    return mongoose.connection
}

export default conctaNaDatabase