import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import usuariosRouter from "./routes/usuarios.routes.js";
import chamadosRouter from "./routes/chamados.routes.js";
import { authMiddleware } from "./middlewares/auth.js";

dotenv.config();
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
const app = express();
app.use(cors(
));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});
app.use("/api/usuarios", usuariosRouter);
app.use("/api/chamados", authMiddleware, chamadosRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend rodando na porta ${PORT}`);
});