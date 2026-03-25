let cronometro;
let tempoRestante = 30;

const dificuldade = localStorage.getItem('dificuldadeEscolhida') || 1;
const sessionId   = localStorage.getItem('quizSessionId');

let perguntaAtual = null;

async function buscarPergunta() {
    try {
        const response = await fetch(`/api/perguntas/aleatoria?difficulty=${dificuldade}`);

        if (!response.ok) {
            alert("Fim do quiz ou nenhuma pergunta encontrada para este nível.");
            window.location.href = '/home';
            return;
        }

        const pergunta = await response.json();
        perguntaAtual = pergunta;
        renderizarPergunta(pergunta);

    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

function renderizarPergunta(pergunta) {
    document.getElementById('main-question').textContent = pergunta.description;

    const container = document.getElementById('alternatives-container');
    container.innerHTML = '';

    pergunta.options.forEach((opcao) => {
        const btn = document.createElement('button');
        btn.classList.add('main-alternative');
        btn.textContent = opcao;

        btn.onclick = () => verificarResposta(opcao, pergunta.correctOption, pergunta.options);

        container.appendChild(btn);
    });

    iniciarTimer();
}

async function verificarResposta(opcaoEscolhida, correctOption, options) {
    clearInterval(cronometro);

    document.querySelectorAll('.main-alternative').forEach(b => b.disabled = true);

    // Se for um número (ex: "0", "2"), busca pelo índice. Senão, compara direto por texto.
    let textoCorreto;
    const indice = Number(correctOption);
    if (!isNaN(indice) && options[indice] !== undefined) {
        textoCorreto = options[indice]; // correctOption é índice → pega o texto
    } else {
        textoCorreto = correctOption;   // correctOption já é o texto
    }

    const isCorrect = opcaoEscolhida.trim() === textoCorreto.trim();

    // Feedback visual nas alternativas
    document.querySelectorAll('.main-alternative').forEach((btn) => {
        if (btn.textContent.trim() === textoCorreto.trim()) {
            btn.style.backgroundColor = '#4CAF50'; // verde = correta
            btn.style.color = 'white';
        } else if (btn.textContent.trim() === opcaoEscolhida.trim() && !isCorrect) {
            btn.style.backgroundColor = '#f44336'; // vermelho = errada
            btn.style.color = 'white';
        }
    });

    try {
        const response = await fetch('/api/quiz/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, isCorrect })
        });

        const sessaoAtualizada = await response.json();

        setTimeout(() => {
            if (sessaoAtualizada.isFinished) {
                alert(`Quiz finalizado! Você acertou ${sessaoAtualizada.correctAnswers} de ${sessaoAtualizada.totalQuestions} perguntas.`);
                localStorage.removeItem('quizSessionId');
                localStorage.removeItem('dificuldadeEscolhida');
                window.location.href = '/home';
            } else {
                buscarPergunta();
            }
        }, 1500);

    } catch (error) {
        console.error("Erro ao atualizar progresso:", error);
    }
}

function iniciarTimer() {
    tempoRestante = dificuldade == 3 ? 10 : (dificuldade == 2 ? 20 : 30);

    const elTimer = document.getElementById('quiz-time');
    clearInterval(cronometro);

    cronometro = setInterval(() => {
        tempoRestante--;
        if (elTimer) elTimer.textContent = `Tempo: ${tempoRestante}s`;

        if (tempoRestante <= 0) {
            clearInterval(cronometro);
            // Tempo esgotado — valor impossível garante resposta errada
            verificarResposta('ERRO', perguntaAtual?.correctOption || '', perguntaAtual?.options || []);
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionId) {
        alert("Sessão não encontrada. Inicie o quiz pela Home.");
        window.location.href = '/home';
        return;
    }
    buscarPergunta();
});