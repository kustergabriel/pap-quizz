const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
const dificuldade = urlParams.get('diff');

let perguntas = [];
let indicePerguntaAtual = 0;
let totalPerguntas = 5;

// Verificar resposta
async function verificarResposta(indiceEscolhido, indiceCorreto) {
    const isCorrect = indiceEscolhido === indiceCorreto;
    const botoes = document.querySelectorAll('.main-alternative');

    // Desabilita botões para evitar cliques duplos
    botoes.forEach(b => b.disabled = true);

    // Feedback Visual (Verde para certo, Vermelho para errado)
    botoes[indiceEscolhido].style.backgroundColor = isCorrect ? "#73d68a" : "#dc3545";
    botoes[indiceEscolhido].style.color = "white";
    
    // Mostra a correta caso o usuário tenha errado
    if (!isCorrect) {
        botoes[indiceCorreto].style.backgroundColor = "#73d68a";
        botoes[indiceCorreto].style.color = "white";
    }

    // ENVIA PARA O BACKEND: Atualiza o progresso na sessão do MongoDB
    try {
        await fetch('/api/quiz/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, isCorrect })
        });
    } catch (error) {
        console.error("Erro ao sincronizar progresso:", error);
    }

    // Espera 2 segundos e vai para a próxima ou finaliza
    setTimeout(() => {
        indicePerguntaAtual++;
        if (indicePerguntaAtual < totalPerguntas) {
            exibirPergunta();
        } else {
            finalizarQuiz();
        }
    }, 2000);
}

function exibirPergunta() {
    const perguntaAtual = perguntas[indicePerguntaAtual];
    
    textoPergunta.textContent = perguntaAtual.ask;
    contadorTexto.textContent = `Questão ${indicePerguntaAtual + 1}/${totalPerguntas}`;

    // Limpa alternativas anteriores
    containerAlternativas.innerHTML = '';

    // Cria os botões para cada alternativa
    perguntaAtual.options.forEach((opcao, index) => {
        const botao = document.createElement('button');
        botao.classList.add('main-alternative');
        botao.textContent = opcao;
        botao.onclick = () => verificarResposta(index, perguntaAtual.correct);
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

})

function finalizarQuiz() {
    // Você pode redirecionar para uma página de resultados passando o sessionId
    window.location.href = `/home`;
}



document.addEventListener('DOMContentLoaded', buscarNovaPergunta);
