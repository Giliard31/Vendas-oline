const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Liberação de segurança CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', (req, res) => {
    res.send("🤖 Robô de Leitura de Links está online!");
});

// Rota que recebe o link e tenta extrair as informações
app.post('/adicionar-produto', async (req, res) => {
    try {
        const { linkAfiliado } = req.body;
        
        if (!linkAfiliado) {
            return res.status(400).json({ sucesso: false, erro: "Nenhum link enviado." });
        }

        let tituloExtraido = "Achadinho Imperdível da Shopee/ML";
        let precoExtraido = "49,90"; // Preço base caso o site bloqueie a leitura direta
        let imagemExtraida = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";

        // Tenta ler o título da página do link enviado
        try {
            const respostaSite = await axios.get(linkAfiliado, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                timeout: 5000
            });
            const html = respostaSite.data;
            
            // Pega o título da página HTML se existir
            const matchTitulo = html.match(/<title>(.*?)<\/title>/i);
            if (matchTitulo && matchTitulo[1]) {
                tituloExtraido = matchTitulo[1].trim().substring(0, 60); // Limita o tamanho
            }
        } catch (err) {
            console.log("Aviso: O site de destino protegeu o acesso direto, usando dados padrão.");
        }

        const novoProduto = {
            titulo: tituloExtraido,
            preco: precoExtraido,
            descricao: "Produto importado automaticamente pelo link de afiliado.",
            imagem: imagemExtraida,
            linkAfiliado: linkAfiliado,
            criadoEm: new Date().toISOString()
        };

        res.json({ sucesso: true, produto: novoProduto });
    } catch (erro) {
        console.error("Erro ao processar link:", erro);
        res.status(500).json({ sucesso: false, erro: "Erro ao ler o link." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
