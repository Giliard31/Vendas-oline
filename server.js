const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para ler arquivos JSON
app.use(express.json());

// Rota principal para o Render saber que o robô está acordado e vivo
app.get('/', (req, res) => {
    sendResponse(res, "🤖 Robô de Ofertas da Shopee e Mercado Livre está rodando com sucesso no Render!");
});

// Rota de teste para simular o disparo de uma nova oferta
app.get('/disparar-oferta', (req, res) => {
    // Aqui no futuro o robô vai buscar a oferta e mandar a notificação push
    console.log("Buscando novas ofertas de afiliados...");
    res.json({ status: "Sucesso", mensagem: "Varredura de ofertas realizada!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
