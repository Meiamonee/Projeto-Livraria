class Livro {
    constructor(nome, preco, genero, classificacaoEtaria, promocao) {
        this.nome = nome;
        this.preco = preco;
        this.genero = genero;
        this.classificacaoEtaria = classificacaoEtaria;
        this.promocao = promocao;
        this._id = Date.now(); // Gera um ID único temporário
    }

    setPromocao(status) {
        if (this.promocao !== status) {
            this.promocao = status;
            console.log(`Mudança de promoção para ${this.nome}: ${status}`);
        }
    }
}

class LivroObserver {
    constructor() {
        this.intervalId = null;
    }

    update(livro) {
        const mensagemPromocao = document.getElementById("mensagem-promocao");

        if (livro.promocao) {
            
            mensagemPromocao.textContent = `🎉 ${livro.nome} está em promoção! 🎉`;
            mensagemPromocao.style.display = "block"; 

        
            if (!this.intervalId) {
                this.intervalId = setInterval(() => {
                    mensagemPromocao.textContent = `🎉 ${livro.nome} ainda está em promoção! 🎉`;
                }, 5000);
            }
        } else {

            clearInterval(this.intervalId);
            this.intervalId = null; 
            mensagemPromocao.style.display = "none"; 
        }
    }
}


// Função para exibir a lista de livros
function exibirLivros(livros) {
    const listaLivros = document.getElementById("livros-lista");
    listaLivros.innerHTML = ''; // Limpa a lista antes de adicionar os livros

    livros.forEach(livro => {
        const divLivro = document.createElement("div");
        divLivro.classList.add("livro");
        divLivro.id = `livro-${livro._id}`;

        const alerta = document.createElement("p");
        alerta.classList.add("alerta");
        alerta.textContent = livro.promocao ? "Este livro está em promoção!" : "Este livro não está em promoção.";
        alerta.style.color = livro.promocao ? "red" : "green";

        divLivro.appendChild(alerta);
        divLivro.innerHTML += `
            <strong>${livro.nome}</strong><br>
            Preço: R$ ${livro.preco}<br>
            Gênero: ${livro.genero}<br>
            Classificação Etária: ${livro.classificacaoEtaria}<br>
            <button onclick="editarLivro('${livro._id}')">Editar</button>
        `;

        listaLivros.appendChild(divLivro);

        // Adiciona o observer para o livro
        const observer = new LivroObserver();
        observer.update(livro); 
    });
}

// Função para adicionar um livro
async function adicionarLivro(event) {
    event.preventDefault(); 

    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const genero = document.getElementById("genero").value;
    const classificacaoEtaria = document.getElementById("classificacaoEtaria").value;
    const promocao = document.getElementById("promocao").checked;

    const livro = {
        nome,
        preco,
        genero,
        classificacaoEtaria,
        promocao
    };

    try {
        const response = await fetch('/livros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            buscarLivros(); 
        } else {
            alert(result.message); 
        }
    } catch (error) {
        console.error('Erro ao adicionar livro:', error);
        alert('Erro ao adicionar livro');
    }
}

// Função para editar um livro
async function editarLivro(id) {
    const modal = document.getElementById("modal-editar");
    const novoPrecoInput = document.getElementById("novo-preco");
    const novaPromocaoSelect = document.getElementById("nova-promocao");
    
    // Abre o modal
    modal.style.display = "block";

    // Adiciona evento para salvar a edição
    document.getElementById("salvar-edicao").onclick = async () => {
        const preco = parseFloat(novoPrecoInput.value);
        const promocao = novaPromocaoSelect.value === "true";

        const livro = { preco, promocao };

        try {
            const response = await fetch(`/livros/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(livro)
            });

            // Você pode remover a mensagem de alerta aqui
            if (response.ok) {
                buscarLivros(); // Atualiza a lista de livros
            }
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
        }

        modal.style.display = "none"; // Fecha o modal
    };

    // Fecha o modal quando o usuário clica no "x"
    document.getElementById("fechar-modal").onclick = () => {
        modal.style.display = "none"; // Fecha o modal
    };

    // Fecha o modal se o usuário clicar fora do conteúdo do modal
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none"; // Fecha o modal
        }
    };
}



// Função para buscar livros
async function buscarLivros() {
    try {
        const response = await fetch('/livros'); // Requisição GET para buscar os livros do banco de dados
        const livros = await response.json();
        exibirLivros(livros); // Exibe os livros retornados do backend
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
    }
}

// Adicionar evento ao formulário de livro
document.getElementById("livro-form").addEventListener("submit", adicionarLivro);

// Carregar os livros quando a página for carregada
window.onload = buscarLivros;
