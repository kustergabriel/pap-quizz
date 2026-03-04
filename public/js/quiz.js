// Verificar resposta
async function verificarResposta (indiceClicado, opcaoCorreta) {
    const container = document.getElementById('alternatives-container');
    const botoes = container.querySelectorAll('.main-alternative');
    
    const acertou = String(indiceClicado) === opcaoCorreta;

    botoes.forEach((botao, i) => {
        botao.disabled = true; // Impede cliques repetidos
        
        if (String(i) === opcaoCorreta) {
            botao.style.backgroundColor = "#73d68a"; // Verde para a correta
            botao.style.color = "white";
        } else if (i === indiceClicado && !acertou) {
            botao.style.backgroundColor = "#dc3545"; // Vermelho se errou
            botao.style.color = "white";
        }
    });

    // Espera 2 segundos e carrega a próxima
    setTimeout(() => {
        buscarNovaPergunta();
    }, 2000);
}

