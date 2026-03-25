const botaoExit = document.getElementById('header-exit');

document.addEventListener('DOMContentLoaded', async () => {

    const btnComecar = document.querySelector('#btn-comecar-quiz');
    const selectDificuldade = document.querySelector('#select-dificuldade');

    try {
        const resposta = await fetch('/api/me');
        const dados = await resposta.json();
        if (resposta.ok) {
            document.getElementById('bem-vindo').textContent = `Bem-vindo, ${dados.nickname}!`;
            document.getElementById('id-pontos').textContent = `${dados.points} pontos`;
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
    }

    if (btnComecar) {
        btnComecar.addEventListener('click', async () => {
            const nivelSelecionado = selectDificuldade.value;

            try {
                const response = await fetch('/api/quiz/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ difficulty: nivelSelecionado })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('quizSessionId', data.sessionId);
                    localStorage.setItem('dificuldadeEscolhida', nivelSelecionado);

                    window.location.href = '/quiz';
                } else {
                    alert("Erro: " + data.message);
                }
            } catch (error) {
                console.error("Erro ao iniciar quiz:", error);
            }
        });
    }
});

botaoExit.addEventListener('click', async () => {
    try {
        const resposta = await fetch('/api/logout', { method: 'POST' });
        if (resposta.ok) {
            window.location.href = '/login';
        } else {
            alert("Erro ao tentar sair.");
        }
    } catch (error) {
        console.error("Erro no logout:", error);
    }
});