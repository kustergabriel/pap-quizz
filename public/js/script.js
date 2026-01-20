const loginUsuario = document.getElementById('form-login');
const cadastroFormulario = document.getElementById('form-card');

if (cadastroFormulario) {
    const botao = document.querySelector('.btn-submit'); 
    const campos = cadastroFormulario.querySelectorAll('input');
    const inputCpf = document.getElementById('cpf');
    const campoSenha = document.getElementById('pass');
    const campoConfirmarSenha = document.getElementById('confirm-pass');

function validarFormulario() {
    let todosPreenchidos = true;
    const senhaCurta = campoSenha.value.length < 8

    campos.forEach(input => {
        if (input.value.trim() === "") {
            todosPreenchidos = false;
        }
    });

    const senhasIguais = campoSenha.value === campoConfirmarSenha.value

    // O botão só ativa se as duas condições forem verdadeiras
    if (todosPreenchidos && senhasIguais && !senhaCurta) {
        botao.disabled = false;
        botao.classList.add('active');
        campoConfirmarSenha.style.borderColor = "#dee2e6"; 
    } else {
        botao.disabled = true;
        botao.classList.remove('active');
        
        // Feedback visual se o usuário já começou a digitar a confirmação e está errada
        if (campoConfirmarSenha.value.length > 0 && !senhasIguais) {
            campoConfirmarSenha.style.borderColor = "#ff4d4d"; 
        } else {
            campoConfirmarSenha.style.borderColor = "#dee2e6";
        }
    }
}

campos.forEach(input => {
    input.addEventListener('input', validarFormulario);
});


if (inputCpf) {
        inputCpf.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, ""); 
            if (v.length > 11) v = v.slice(0, 11); 
            v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
            validarFormulario(); 
        });
    }

// Cadastro
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
            // Troca de pagina para o login
            console.log("Sucesso:", resultado);
            window.location.href = '/login'
        } else {
            const erroNickname = document.getElementById('msg-erro-nickname');
            const erroCpf = document.getElementById('msg-erro-cpf');
            const erroEmail = document.getElementById('msg-erro-email')

            erroCpf.textContent = ''
            erroEmail.textContent = ''
            erroNickname.textContent = ''

            if (resultado.message.includes("nome de usuário") ) {
                erroNickname.textContent = resultado.message;
                document.getElementById('nickname').style.borderColor = "#ff4d4d";
            } else if (resultado.message.includes("CPF")) {
                erroCpf.textContent = resultado.message;
                document.getElementById('cpf').style.borderColor = "#ff4d4d";
            } else if (resultado.message.includes("e-mail")) {
                erroEmail.textContent = resultado.message;
                document.getElementById('email').style.borderColor = "#ff4d4d";
            } else {
                // Caso seja um erro genérico
                alert(resultado.message);
            }
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
    }
});
}

// Login
if (loginUsuario) {
loginUsuario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = {
        nickname: document.getElementById('login-user').value,
        password: document.getElementById('login-pass').value
    }

    try {
            const resposta = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(login)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            console.log("Sucesso:", resultado);
            window.location.href = '/home';  
        } else {
            alert("Erro no login: " + (resultado.message || "Erro desconhecido"));
                }
        } catch (erro) {
        console.error("Erro na requisição:", erro);
    }
})
}