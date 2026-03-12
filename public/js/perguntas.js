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
