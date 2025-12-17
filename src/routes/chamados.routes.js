import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { writeFile, unlink } from "node:fs/promises";
import { pool } from "../database/db.js";

const router = Router();
const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const ESTADOS_VALIDOS = new Set(["a", "f"]);
function parseIdParam(param) {
    const id = Number(param);
    return Number.isInteger(id) && id > 0 ? id : null;
}
function isEstadoValido(estado) {
    return ESTADOS_VALIDOS.has(estado);
}
function gerarNomeArquivo(originalname) {
    const ext = path.extname(originalname).toLowerCase();
    return `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
}
function montarUrlCompleta(req, filename) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}/uploads/${filename}`;
}
async function salvarUploadEmDisco(req, file) {
    if (!file) return null;
    const filename = gerarNomeArquivo(file.originalname);
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, file.buffer);
    return montarUrlCompleta(req, filename);
}
async function removerArquivoPorUrl(url_imagem) {
    if (!url_imagem) return;

    try {
        const { pathname } = new URL(url_imagem);
        const filename = path.basename(pathname);
        const filePath = path.join(uploadDir, filename);

        await unlink(filePath);
    } catch {
    }
}
function getAuthInfo(req, res) {
    console.log(req.user)
    const uid = req.user?.id;
    const isAdmin = req.user?.papel === 1;
    if (!uid) {
        res.status(401).json({ erro: "não autenticado" });
        return null;
    }
    return { uid, isAdmin };
}
async function obterChamadoPorId(id) {
    const { rows } = await pool.query(
        `SELECT * FROM "Pedidos" WHERE "id" = $1`,
        [id]
    );
    return rows[0] ?? null;
}
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {

        fileSize: 5 * 1024 * 1024,
    },
});
router.get("/", async (_req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM "Pedidos" ORDER BY "id" DESC`
        );
        res.json(rows);
    } catch {
        res.status(500).json({ erro: "erro interno" });
    }
});
router.get("/:id", async (req, res) => {
    const id = parseIdParam(req.params.id);
    if (!id) {
        return res.status(400).json({ erro: "id inválido" });
    }
    try {
        const chamado = await obterChamadoPorId(id);
        if (!chamado) return res.status(404).json({ erro: "não encontrado" });
        res.json(chamado);
    } catch {
        res.status(500).json({ erro: "erro interno" });
    }
});
router.post("/", upload.single("imagem"), async (req, res) => {
    const auth = getAuthInfo(req, res);
    if (!auth) return;
    const { uid } = auth;
    const { texto, estado } = req.body ?? {};
    const est = estado ?? "a";
    const temTextoValido = typeof texto === "string" && texto.trim() !== "";
    const temEstadoValido = isEstadoValido(est);
    if (!temTextoValido || !temEstadoValido) {
         return res.status(400).json({
            erro:
                "Campos obrigatórios: texto (string não vazia) e estado ('a' ou 'f' — se ausente, assume 'a')",
        });
    }
    let urlImagem = null;
    try {
        if (req.file) {
            urlImagem = await salvarUploadEmDisco(req, req.file);
        }
        const { rows } = await pool.query(
            `INSERT INTO "Pedidos" ("Usuarios_id", "texto", "estado", "url_imagem")
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [uid, texto.trim(), est, urlImagem]
        );
        res.status(201).json(rows[0]);
    } catch {
        if (urlImagem) {
            await removerArquivoPorUrl(urlImagem);
        }
        res.status(500).json({ erro: "erro interno" });
    }
});
router.put("/:id", upload.single("imagem"), async (req, res) => {
    const id = parseIdParam(req.params.id);
    if (!id) {
        return res.status(400).json({ erro: "id inválido" });
    }
    const auth = getAuthInfo(req, res);
    if (!auth) return;
    const { uid, isAdmin } = auth;
    const { texto, estado } = req.body ?? {};
    const temTextoValido = typeof texto === "string" && texto.trim() !== "";
    const temEstadoValido = isEstadoValido(estado);
    if (!temTextoValido || !temEstadoValido) {
        return res.status(400).json({
            erro:
                "Para PUT, envie texto (string não vazia) e estado ('a' | 'f'); imagem é opcional.",
        });
    }
    let urlImagemNova = null;
    let urlImagemAntiga = null;
    try {
        const chamado = await obterChamadoPorId(id);
        if (!chamado) {
            return res.status(404).json({ erro: "não encontrado" });
        }
        if (!isAdmin && chamado.Usuarios_id !== uid) {
            return res.status(404).json({ erro: "não encontrado" });
        }
        urlImagemAntiga = chamado.url_imagem;
        if (req.file) {
            urlImagemNova = await salvarUploadEmDisco(req, req.file);
        } else {
            urlImagemNova = urlImagemAntiga;
        }
        const { rows } = await pool.query(
            `UPDATE "Pedidos"
             SET "texto"            = $1,
                 "estado"           = $2,
                 "url_imagem"       = $3,
                 "data_atualizacao" = now()
             WHERE "id" = $4
             RETURNING *`,
            [texto.trim(), estado, urlImagemNova, id]
        );
        if (!rows[0]) {
            if (req.file && urlImagemNova) {
                await removerArquivoPorUrl(urlImagemNova);
            }
            return res.status(404).json({ erro: "não encontrado" });
        }
        if (
            req.file &&
            urlImagemAntiga &&
            urlImagemAntiga !== urlImagemNova
        ) {
            await removerArquivoPorUrl(urlImagemAntiga);
        }
        res.json(rows[0]);
    } catch {
        if (req.file && urlImagemNova) {
            await removerArquivoPorUrl(urlImagemNova);
        }
        res.status(500).json({ erro: "erro interno" });
    }
});
router.patch("/:id", upload.single("imagem"), async (req, res) => {
    const id = parseIdParam(req.params.id);
    if (!id) {
        return res.status(400).json({ erro: "id inválido" });
    }
    const auth = getAuthInfo(req, res);
    if (!auth) return;
    const { uid, isAdmin } = auth;
    const body = req.body ?? {};
    const { texto, estado, url_imagem } = body;
    const querAtualizarTexto = texto !== undefined;
    const querAtualizarEstado = estado !== undefined;
    const querAtualizarImagem =
        !!req.file || url_imagem === null;
    if (!querAtualizarTexto && !querAtualizarEstado && !querAtualizarImagem) {
        return res
            .status(400)
            .json({ erro: "envie ao menos um campo para atualizar" });
    }
    let novoTexto = undefined;
    if (querAtualizarTexto) {
        if (typeof texto !== "string" || texto.trim() === "") {
            return res
                .status(400)
                .json({ erro: "texto deve ser string não vazia" });
        }
        novoTexto = texto.trim();
    }
    let novoEstado = undefined;
    if (querAtualizarEstado) {
        if (!isEstadoValido(estado)) {
            return res.status(400).json({ erro: "estado deve ser 'a' ou 'f'" });
        }
        novoEstado = estado;
    }
    if (url_imagem !== undefined && url_imagem !== null) {
        return res.status(400).json({
            erro:
                "Para alterar imagem via PATCH, envie um arquivo em 'imagem' ou url_imagem = null para remover.",
        });
    }
    let urlImagemAntiga = null;
    let urlImagemNova = null;
    let criouNovaImagem = false;
    try {
        const chamado = await obterChamadoPorId(id);
        if (!chamado) {
            return res.status(404).json({ erro: "não encontrado" });
        }
        if (!isAdmin && chamado.Usuarios_id !== uid) {
            return res.status(404).json({ erro: "não encontrado" });
        }
        urlImagemAntiga = chamado.url_imagem;
        if (req.file) {
            urlImagemNova = await salvarUploadEmDisco(req, req.file);
            criouNovaImagem = true;
        } else if (url_imagem === null) {
            urlImagemNova = null;
        } else {
            urlImagemNova = urlImagemAntiga;
        }
        const textoFinal = novoTexto !== undefined ? novoTexto : chamado.texto;
        const estadoFinal =
            novoEstado !== undefined ? novoEstado : chamado.estado;
        const { rows } = await pool.query(
            `UPDATE "Pedidos"
             SET "texto"            = $1,
                 "estado"           = $2,
                 "url_imagem"       = $3,
                 "data_atualizacao" = now()
             WHERE "id" = $4
             RETURNING *`,
            [textoFinal, estadoFinal, urlImagemNova, id]
        );
        if (!rows[0]) {
            if (criouNovaImagem && urlImagemNova) {
                await removerArquivoPorUrl(urlImagemNova);
            }
            return res.status(404).json({ erro: "não encontrado" });
        }
        if (urlImagemAntiga && urlImagemAntiga !== urlImagemNova) {
            await removerArquivoPorUrl(urlImagemAntiga);
        }
        res.json(rows[0]);
    } catch {
        if (criouNovaImagem && urlImagemNova) {
            await removerArquivoPorUrl(urlImagemNova);
        }
        res.status(500).json({ erro: "erro interno" });
    }
});
router.delete("/:id", async (req, res) => {
    const id = parseIdParam(req.params.id);
    if (!id) {
        return res.status(400).json({ erro: "id inválido" });
    }
    const auth = getAuthInfo(req, res);
    if (!auth) return;
    const { uid, isAdmin } = auth;
    try {
        const chamado = await obterChamadoPorId(id);
        if (!chamado) {
            return res.status(404).json({ erro: "não encontrado" });
        }
        if (!isAdmin && chamado.Usuarios_id !== uid) {
            return res.status(404).json({ erro: "não encontrado" });
        }

        await pool.query(`DELETE FROM "Pedidos" WHERE "id" = $1`, [id]);

        if (chamado.url_imagem) {
            await removerArquivoPorUrl(chamado.url_imagem);
        }
        res.status(204).end();
    } catch {
        res.status(500).json({ erro: "erro interno" });
    }
});
export default router;