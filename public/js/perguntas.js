// Buscar uma pergunta nova
async function buscarNovaPergunta () {
    try {
        const resposta = await fetch('/api/perguntas/aleatoria');
        const pergunta = await resposta.json();

        if (resposta.ok) {
            const container = document.getElementById('alternatives-container'); 
            container.innerHTML = '';

            // Exemplo de como exibir na tela
            document.getElementById('main-question').textContent = pergunta.title;
            document.getElementById('pergunta-desc').textContent = pergunta.description;
            
            
            listaOpcoes.forEach((texto, index) => {
                const botao = document.createElement('button');
                botao.classList.add('main-alternative');
                botao.textContent = texto.trim();
                
                // Adiciona um evento de clique para validar a resposta depois
                botao.onclick = () => verificarResposta(index, pergunta.correctOption);
                
                container.appendChild(botao);
        });
            
        }
    } catch (error) {
        console.error("Erro ao carregar quiz:", error);
    }
}


async function cadastrarNovaPergunta () {

    const dadosPergunta = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        options: document.getElementById('options').value,
        correctOption: document.getElementById('correctOption').value,
        difficult: document.getElementById('difficult').value 
    };

    try {
        const resposta = await fetch('/api/perguntas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPergunta)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Pergunta cadastrada com sucesso!");

        } else {
            alert("Erro: " + resultado.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }


}