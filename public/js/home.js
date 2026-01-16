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