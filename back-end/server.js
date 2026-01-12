import "dotenv/config"
import app from './src/app.js'

const PORT = 3000 // Porta em que sera hospedado


app.listen(PORT, () => {
    console.log("Escutando!")
})