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

    try {
        const resposta = await fetch ('/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })    
        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Usuário cadastrado com sucesso!");
            console.log("Sucesso:", resultado);
        } else {
            alert("Erro no cadastro: " + (resultado.message || "Erro desconhecido"));
            }
        } catch (erro) {
        console.error("Erro na requisição:", erro);
        }

})

