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
        const newUser = await fetch ('/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })    
        const resultado = await resposta.json();

        if (resposta.ok) {
            const resultado = await resposta.json();
            console.log("Resposta do servidor:", resultado);
            alert("Cadastrado com sucesso no Banco de Dados!");
        } else {
            alert('Erro ao cadastrar: ' + resultado.message);
            console.error("O servidor recebeu, mas deu erro.");
            alert("Erro ao cadastrar.");
            }
        } catch (erro) {
        console.error('Erro na requisição:', erro);
        alert('Não foi possível conectar ao servidor.');
        }

})

