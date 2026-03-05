document.addEventListener('DOMContentLoaded', async () => { 
    // 1. Carregar dados do Usuário
    try {
        const resposta = await fetch('/api/me');
        const dados = await resposta.json();
        
        if (resposta.ok) {
            // Verifica se os elementos existem antes de tentar mudar o texto
            const elBemVindo = document.getElementById('bem-vindo');
            const elPontos = document.getElementById('id-pontos');
            
            if (elBemVindo) elBemVindo.textContent = `Bem-vindo, ${dados.nickname}!`;
            if (elPontos) elPontos.textContent = `${dados.points} pontos`;
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
    }

    const botaoExit = document.getElementById('header-exit');
    if (botaoExit) { // Só adiciona o evento se o botão existir na página, pode acarretar em algum erro se nao tivesse essa validacao
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
    }

    // Escolher a dificuldade do jogo
    const botaoComecar = document.getElementById('btn-começar-quiz');
    const seletorDificuldade = document.getElementById('select-dificuldade');

    if (botaoComecar) {
        botaoComecar.addEventListener('click', async () => {
            const nivel = parseInt(seletorDificuldade.value);
            
            try {
                const resposta = await fetch('/api/quiz/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ difficulty: nivel })
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    window.location.href = `/quiz?sessionId=${dados.sessionId}&diff=${nivel}`;
                } else {
                    alert("Erro ao iniciar o quiz no servidor.");
                }
            } catch (error) {
                console.error("Erro na requisição de início:", error);
            }
        });
    }

});