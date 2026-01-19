const botaoExit = document.getElementById('header-exit');

document.addEventListener('DOMContentLoaded', async () => { 
    try {
        const resposta = await fetch('/api/me')
        const dados = await resposta.json()
        if (resposta.ok) {
            document.getElementById('bem-vindo').textContent = `Bem-vindo, ${dados.nickname}!`;
            document.getElementById('id-pontos').textContent = `${dados.points} pontos`;
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
    }

})


botaoExit.addEventListener('click', async (event) => {
    try {
    const resposta = await fetch('/api/logout', { method: 'POST' });
    if (resposta.ok) {
            // 2. Se o servidor limpou tudo, voltamos para o login
            window.location.href = '/login';
        } else {
            alert("Erro ao tentar sair.");
        }
    } catch (error) {
        console.error("Erro no logout:", error);
    }
}) 
