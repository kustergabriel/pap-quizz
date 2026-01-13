

const cadastroFormulario = document.getElementById('form-card')

cadastroFormulario.addEventListener ('submit', async (event) => {
    event.preventDefault()

    const dados = {
        name: document.getElementById('user').value,
        nickname: document.getElementById('nickname').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        password: document.getElementById('pass').value
    }

    console.log("Dados capturados com sucesso:", dados);
    
})

