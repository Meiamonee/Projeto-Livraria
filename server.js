// Importando as dependências necessárias
const express = require('express');
const mongoose = require('mongoose');
const http = require('http'); 
const WebSocket = require('ws');  

const app = express();
const server = http.createServer(app);  
const wss = new WebSocket.Server({ server });  

app.use(express.json());
app.use(express.static('public'));

// Conexão com o MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Livraria', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado!"))
  .catch(err => console.log("Erro ao conectar com MongoDB:", err));

// Definindo um esquema de Livro para o MongoDB
const livroSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  genero: String,
  classificacaoEtaria: String,
  promocao: Boolean
});

const Livro = mongoose.model('Livro', livroSchema);

// Adicionando a rota básica
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/livros', async (req, res) => {
  const { genero, promocao } = req.query;

  try {
    const query = {};
    if (genero) query.genero = genero;
    if (promocao) query.promocao = promocao === 'true';

    const livros = await Livro.find(query);
    res.json(livros);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar livros", error: err });
  }
});

app.post('/livros', async (req, res) => {
  const { nome, preco, genero, classificacaoEtaria, promocao } = req.body;

  try {
    const livro = new Livro({
      nome,
      preco,
      genero,
      classificacaoEtaria,
      promocao
    });

    await livro.save(); 
    res.status(201).json({ message: 'Livro adicionado com sucesso!', livro });

    notificarPromocao(livro);

  } catch (err) {
    res.status(500).json({ message: "Erro ao adicionar livro", error: err });
  }
});


// Rota PUT para atualizar um livro
app.put('/livros/:id', async (req, res) => {
  const { id } = req.params;
  const { preco, promocao } = req.body;

  try {
      const livro = await Livro.findByIdAndUpdate(
          id,
          { preco, promocao },
          { new: true } 
      );

      if (!livro) {
          return res.status(404).json({ message: "Livro não encontrado!" });
      }

      res.status(200).send(); 
  } catch (err) {
      res.status(500).json({ message: "Erro ao atualizar livro", error: err });
  }
});

  
  

// Função para notificar todos os clientes conectados sobre a promoção de um livro
function notificarPromocao(livro) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ livro }));
    }
  });
}

// Definindo a porta onde o servidor irá rodar
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
