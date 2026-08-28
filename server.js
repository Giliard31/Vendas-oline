const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
  projectId: "minhas-ofertas-b7e7c"
});
const db = getFirestore();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Liberação de segurança (CORS) para aceitar requisições de qualquer tela/app
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', (req, res) => {
    res.send("🤖 Robô de Ofertas está online e funcionando!");
});

app.post('/adicionar-produto', async (req, res) => {
    try {
        const { linkAfiliado } = req.body;
        
        if (!linkAfiliado) {
            return res.status(400).json({ sucesso: false, erro: "Nenhum link enviado." });
        }

        const novoProduto = {
            titulo: "Achadinho Especial da Web",
            preco: "99,90",
            descricao: "Produto selecionado automaticamente pelo link de afiliado.",
            imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            linkAfiliado: linkAfiliado,
            criadoEm: new Date().toISOString()
        };

        await db.collection('produtos').add(novoProduto);
        res.json({ sucesso: true, mensagem: "Produto cadastrado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        res.status(500).json({ sucesso: false, erro: "Erro interno no servidor." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
