const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Importa o Firebase Admin para mexer no banco com permissão total do servidor
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Como estamos no Render, vamos inicializar o Firestore no servidor
// (Nota: Para segurança máxima, depois configuramos a chave privada do Firebase Admin, mas para testar vamos usar a conexão padrão)
const appFirebase = initializeApp({
  projectId: "minhas-ofertas-b7e7c"
});
const db = getFirestore();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota principal
app.get('/', (req, res) => {
    res.send("🤖 Robô de Ofertas da Shopee e Mercado Livre está rodando com sucesso no Render!");
});

// Rota para cadastrar o produto automaticamente através do link
app.post('/adicionar-produto', async (req, res) => {
    try {
        const { linkAfiliado } = req.body;
        
        if (!linkAfiliado) {
            return res.status(400).json({ erro: "Nenhum link foi enviado." });
        }

        // Aqui criamos um registro inicial com o link que você mandou
        // No futuro podemos incrementar com uma biblioteca de leitura de HTML, 
        // mas por enquanto já salva com imagem padrão e título pré-definido para você testar na hora!
        const novoProduto = {
            titulo: "Achadinho Especial da Web",
            preco: "99,90",
            descricao: "Produto selecionado automaticamente pelo link de afiliado.",
            imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", // Foto de exemplo bonita
            linkAfiliado: linkAfiliado,
            criadoEm: new Date().toISOString()
        };

        // Salva na coleção "produtos" lá no Firebase Firestore
        await db.collection('produtos').add(novoProduto);

        res.json({ sucesso: true, mensagem: "Produto cadastrado com sucesso na vitrine!" });
    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        res.status(500).json({ erro: "Erro ao processar o link no servidor." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
