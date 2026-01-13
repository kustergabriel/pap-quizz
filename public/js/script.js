const cadastroFormulario = document.getElementById('form-card');
const botao = document.querySelector('.btn-submit'); 
const campos = cadastroFormulario.querySelectorAll('input');
const inputCpf = document.getElementById('cpf');
const campoSenha = document.getElementById('pass');
const campoConfirmarSenha = document.getElementById('confirm-pass');

function validarFormulario() {
    let todosPreenchidos = true;

    campos.forEach(input => {
        if (input.value.trim() === "") {
            todosPreenchidos = false;
        }
    });

    const senhasIguais = campoSenha.value === campoConfirmarSenha.value

    // O botão só ativa se as duas condições forem verdadeiras
    if (todosPreenchidos && senhasIguais) {
        botao.disabled = false;
        botao.classList.add('active');
        campoConfirmarSenha.style.borderColor = "#dee2e6"; // Cor padrão
    } else {
        botao.disabled = true;
        botao.classList.remove('active');
        
        // Feedback visual se o usuário já começou a digitar a confirmação e está errada
        if (campoConfirmarSenha.value.length > 0 && !senhasIguais) {
            campoConfirmarSenha.style.borderColor = "#ff4d4d"; // Borda vermelha de erro
        } else {
            campoConfirmarSenha.style.borderColor = "#dee2e6";
        }
    }
}

campos.forEach(input => {
    input.addEventListener('input', validarFormulario);
});

validarFormulario();

inputCpf.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, ""); 

    if (v.length > 11) v = v.slice(0, 11); 

    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    e.target.value = v;
    
    validarFormulario(); 
});

cadastroFormulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dados = {
        name: document.getElementById('user').value,
        nickname: document.getElementById('nickname').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        password: document.getElementById('pass').value // ver como fazer a seguranca disso aqui
    };

    try {
        const resposta = await fetch('/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            // alert("Usuário cadastrado com sucesso!");
            console.log("Sucesso:", resultado);
            // Aqui você pode redirecionar: window.location.href = '/login.html'
            window.location.href = '/login'
            
        } else {
            alert("Erro no cadastro: " + (resultado.message || "Erro desconhecido"));
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
    }
});