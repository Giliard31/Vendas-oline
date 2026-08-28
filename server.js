const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Liberação de segurança (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', (req, res) => {
    res.send("🤖 Robô de Ofertas está online e funcionando!");
});

// Rota simplificada que recebe o link e confirma o recebimento
app.post('/adicionar-produto', async (req, res) => {
    try {
        const { linkAfiliado } = req.body;
        
        if (!linkAfiliado) {
            return res.status(400).json({ sucesso: false, erro: "Nenhum link enviado." });
        }

        // Como o front-end (index.html) já tem conexão direta com o Firebase do seu projeto,
        // o servidor apenas valida e devolve os dados prontos para o seu app salvar direto na nuvem sem erro de chave!
        const novoProduto = {
            titulo: "Achadinho Especial da Web",
            preco: "99,90",
            descricao: "Produto selecionado automaticamente pelo link de afiliado.",
            imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            linkAfiliado: linkAfiliado,
            criadoEm: new Date().toISOString()
        };

        res.json({ sucesso: true, produto: novoProduto });
    } catch (erro) {
        console.error("Erro ao processar:", erro);
        res.status(500).json({ sucesso: false, erro: "Erro interno no servidor." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
