const loginUsuario = document.getElementById('form-login');
const cadastroFormulario = document.getElementById('form-card');
const botoesMostrarSenha = document.querySelectorAll('[data-toggle-password]');

function atualizarIconeSenha(botao, visivel) {
    const icone = botao.querySelector('[data-lucide]');

    if (!icone) {
        return;
    }

    icone.setAttribute('data-lucide', visivel ? 'eye-off' : 'eye');

    if (window.lucide && typeof window.lucide.replaceElement === 'function') {
        window.lucide.replaceElement(icone);
    }
}

botoesMostrarSenha.forEach((botao) => {
    atualizarIconeSenha(botao, false);

    botao.addEventListener('click', () => {
        const inputId = botao.getAttribute('data-toggle-password');
        const campo = document.getElementById(inputId);

        if (!campo) {
            return;
        }

        const senhaVisivel = campo.type === 'password';
        campo.type = senhaVisivel ? 'text' : 'password';
        atualizarIconeSenha(botao, senhaVisivel);
    });
});

if (cadastroFormulario) {
    const botao = document.querySelector('.btn-submit');
    const campos = cadastroFormulario.querySelectorAll('input');
    const inputCpf = document.getElementById('cpf');
    const campoSenha = document.getElementById('pass');
    const campoConfirmarSenha = document.getElementById('confirm-pass');
    const campoNickname = document.getElementById('nickname');
    const campoEmail = document.getElementById('email');

    function limparMensagensDeErro() {
        const erroNickname = document.getElementById('msg-erro-nickname');
        const erroCpf = document.getElementById('msg-erro-cpf');
        const erroEmail = document.getElementById('msg-erro-email');

        if (erroNickname) erroNickname.textContent = '';
        if (erroCpf) erroCpf.textContent = '';
        if (erroEmail) erroEmail.textContent = '';

        if (inputCpf) inputCpf.style.borderColor = '#bddcff';
        if (campoNickname) campoNickname.style.borderColor = '#bddcff';
        if (campoEmail) campoEmail.style.borderColor = '#bddcff';
    }

    function validarFormulario() {
        let todosPreenchidos = true;
        const senhaCurta = campoSenha.value.length < 8;

        campos.forEach((input) => {
            if (input.value.trim() === '') {
                todosPreenchidos = false;
            }
        });

        const senhasIguais = campoSenha.value === campoConfirmarSenha.value;

        if (todosPreenchidos && senhasIguais && !senhaCurta) {
            botao.disabled = false;
            botao.classList.add('active');
            campoConfirmarSenha.style.borderColor = '#bddcff';
        } else {
            botao.disabled = true;
            botao.classList.remove('active');

            if (campoConfirmarSenha.value.length > 0 && !senhasIguais) {
                campoConfirmarSenha.style.borderColor = '#ff4d4d';
            } else {
                campoConfirmarSenha.style.borderColor = '#bddcff';
            }
        }
    }

    campos.forEach((input) => {
        input.addEventListener('input', () => {
            limparMensagensDeErro();
            validarFormulario();
        });
    });

    if (inputCpf) {
        inputCpf.addEventListener('input', (event) => {
            let valor = event.target.value.replace(/\D/g, '');

            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }

            valor = valor
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

            event.target.value = valor;
            validarFormulario();
        });
    }

    cadastroFormulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dados = {
            name: document.getElementById('user').value,
            nickname: document.getElementById('nickname').value,
            cpf: document.getElementById('cpf').value,
            email: document.getElementById('email').value,
            password: document.getElementById('pass').value
        };

        try {
            const resposta = await fetch('/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                console.log('Sucesso:', resultado);
                window.location.href = '/login';
            } else {
                const erroNickname = document.getElementById('msg-erro-nickname');
                const erroCpf = document.getElementById('msg-erro-cpf');
                const erroEmail = document.getElementById('msg-erro-email');

                if (erroCpf) erroCpf.textContent = '';
                if (erroEmail) erroEmail.textContent = '';
                if (erroNickname) erroNickname.textContent = '';

                if (resultado.message.includes('nome de usuário')) {
                    if (erroNickname) erroNickname.textContent = resultado.message;
                    document.getElementById('nickname').style.borderColor = '#ff4d4d';
                } else if (resultado.message.includes('CPF')) {
                    if (erroCpf) erroCpf.textContent = resultado.message;
                    document.getElementById('cpf').style.borderColor = '#ff4d4d';
                } else if (resultado.message.includes('e-mail')) {
                    if (erroEmail) erroEmail.textContent = resultado.message;
                    document.getElementById('email').style.borderColor = '#ff4d4d';
                } else {
                    alert(resultado.message);
                }
            }
        } catch (erro) {
            console.error('Erro na requisição:', erro);
        }
    });
}

if (loginUsuario) {
    loginUsuario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const login = {
            nickname: document.getElementById('login-user').value,
            password: document.getElementById('login-pass').value
        };

        try {
            const resposta = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(login)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                console.log('Sucesso:', resultado);
                window.location.href = '/home';
            } else {
                alert('Erro no login: ' + (resultado.message || 'Erro desconhecido'));
            }
        } catch (erro) {
            console.error('Erro na requisição:', erro);
        }
    });
}

const btnIrParaCadastro = document.getElementById('btn-ir-para-cadastro');

if (btnIrParaCadastro) {
    btnIrParaCadastro.addEventListener('click', () => {
        window.location.href = '/cadastro';
    });
}
