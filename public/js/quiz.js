const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
const dificuldade = urlParams.get('diff');

let perguntas = [];
let indicePerguntaAtual = 0;
let totalPerguntas = 5;
let tempoRestante = 10;
let cronometro;

// Timer para cada pergunta
function iniciarTimer() {
    tempoRestante = 10; 
    const elTimer = document.getElementById('quiz-time');
    if (elTimer) elTimer.textContent = `Tempo: 10s`;

    clearInterval(cronometro); 
    cronometro = setInterval(() => {
        tempoRestante--;
        if (elTimer) elTimer.textContent = `Tempo: ${tempoRestante}s`;

        if (tempoRestante <= 0) {
            clearInterval(cronometro);
            pularPorTempoEsgotado();
        }
    }, 1000);
}

function pularPorTempoEsgotado() {
    // Simulamos um clique errado enviando um objeto "fake"
    const dummyButton = { textContent: "TEMPO ESGOTADO" };
    verificarResposta(dummyButton, "RESPOSTA_INCORRETA_SISTEMA");
}

// Verificar resposta
async function verificarResposta(botaoClicado, valorCorreto) {
    // PARA o cronômetro assim que o usuário responder (ou o tempo acabar)
    clearInterval(cronometro);

    const valorEscolhido = botaoClicado.textContent;
    const isCorrect = valorEscolhido === valorCorreto;
    const todosBotoes = document.querySelectorAll('.main-alternative');

    todosBotoes.forEach(b => b.disabled = true);

    // SÓ tenta mudar o estilo se o botão for real (tiver a propriedade style)
    if (botaoClicado.style) {
        botaoClicado.style.backgroundColor = isCorrect ? "#73d68a" : "#dc3545";
        botaoClicado.style.color = "white";
    }

    // Se errou (ou acabou o tempo), mostra a correta
    if (!isCorrect) {
        todosBotoes.forEach(b => {
            if (b.textContent === valorCorreto) {
                b.style.backgroundColor = "#73d68a";
                b.style.color = "white";
            }
        });
    }

    // O fetch continua igual, enviando isCorrect: false se o tempo acabou
    try {
        await fetch('/api/quiz/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, isCorrect })
        });
    } catch (error) { console.error(error); }

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
    
    const elCategoria = document.getElementById('quiz-category');
    if (elCategoria) elCategoria.textContent = perguntaAtual.title;

    const contadorTexto = document.getElementById('quiz-cont-ask');
    if (contadorTexto) contadorTexto.textContent = `Questão ${indicePerguntaAtual + 1}/${perguntas.length}`;

    const textoPergunta = document.getElementById('main-question');
    textoPergunta.textContent = perguntaAtual.description;

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
        iniciarTimer();
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