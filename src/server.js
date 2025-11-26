import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import usuariosRouter from "./routes/usuarios.routes.js"; // Certifique-se de que o caminho está correto

// Carrega as variáveis de ambiente (como PORT) do arquivo .env
dotenv.config();

const app = express();

// CORS OBRIGATÓRIO
app.use(cors({
    origin: "http://localhost:5173",   // A PORTA DO SEU FRONT!
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ROTA DE TESTE (Adicionada para evitar o erro "Cannot GET /" na rota raiz)
// Quando o usuário acessa http://localhost:3000, esta rota responde.
app.get("/", (req, res) => {
    res.status(200).send({
        status: "OK",
        message: "Backend está rodando com sucesso! Acesse /api/usuarios para interagir com as rotas de usuário."
    });
});

// ROTAS PRINCIPAIS
app.use("/api/usuarios", usuariosRouter);

// Configuração e inicialização do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));