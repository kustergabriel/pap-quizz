const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
const dificuldade = urlParams.get('diff');

let perguntas = [];
let indicePerguntaAtual = 0;
let totalPerguntas = 5;

// Verificar resposta
async function verificarResposta(botaoClicado, valorCorreto) {
    const valorEscolhido = botaoClicado.textContent;
    const isCorrect = valorEscolhido === valorCorreto;
    const todosBotoes = document.querySelectorAll('.main-alternative');

    // 1. Bloqueia todos os botões
    todosBotoes.forEach(b => b.disabled = true);

    // 2. Pinta o botão clicado
    if (isCorrect) {
        botaoClicado.style.backgroundColor = "#73d68a"; // Verde
        botaoClicado.style.color = "white";
    } else {
        botaoClicado.style.backgroundColor = "#dc3545"; // Vermelho
        botaoClicado.style.color = "white";

        // 3. Mostra qual era a correta para o usuário aprender
        todosBotoes.forEach(b => {
            if (b.textContent === valorCorreto) {
                b.style.backgroundColor = "#73d68a";
                b.style.color = "white";
            }
        });
    }

    // 4. Sincroniza com o Banco de Dados
    try {
        await fetch('/api/quiz/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, isCorrect })
        });
    } catch (error) {
        console.error("Erro ao salvar progresso:", error);
    }

    // 5. Próxima pergunta após 2 segundos
    setTimeout(() => {
        indicePerguntaAtual++;
        if (indicePerguntaAtual < perguntas.length) {
            exibirPergunta();
        } else {
            finalizarQuiz();
        }
    }, 2000);
}

function exibirPergunta() {
    const perguntaAtual = perguntas[indicePerguntaAtual];
    if (!perguntaAtual) return; // Segurança extra

    const elTitulo = document.getElementById('title-specifications');
    if (elTitulo) elTitulo.textContent = perguntaAtual.title;

    textoPergunta.textContent = perguntaAtual.description;
    
    // Use perguntas.length em vez da variável fixa se quiser ser mais dinâmico
    contadorTexto.textContent = `Questão ${indicePerguntaAtual + 1}/${perguntas.length}`;

    containerAlternativas.innerHTML = '';

    perguntaAtual.options.forEach((opcao) => {
        const botao = document.createElement('button');
        botao.classList.add('main-alternative');
        botao.textContent = opcao;
        
        botao.addEventListener('click', () => {
            // Passamos o botão e a resposta correta
            verificarResposta(botao, perguntaAtual.correctOption);
        });
        
        containerAlternativas.appendChild(botao);
    });
}

// Buscar uma pergunta nova
const textoPergunta = document.getElementById('main-question');
const containerAlternativas = document.getElementById('alternatives-container');
const contadorTexto = document.getElementById('quiz-cont-ask');

async function carregarPerguntas() {
    try {
        
        const resposta = await fetch(`/api/perguntas/sessao?diff=${dificuldade}`);
        perguntas = await resposta.json();

        if (perguntas.length > 0) {
            exibirPergunta();
        } else {
            alert("Não há perguntas suficientes para esta dificuldade.");
        }
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => { 
    try {
        const resposta = await fetch('/api/me')
        const dados = await resposta.json()
        if (resposta.ok) {
            document.getElementById('header-username').textContent = `Usuário: ${dados.nickname}`;
            document.getElementById('header-points').textContent = `${dados.points} pontos`;
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
    }

    carregarPerguntas()
})

function finalizarQuiz() {
    // Você pode redirecionar para uma página de resultados passando o sessionId
    window.location.href = `/home`;
}