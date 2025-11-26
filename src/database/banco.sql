SET client_encoding = 'UTF8';

CREATE TABLE IF NOT EXISTS "Usuarios" (
    "id"                SERIAL        PRIMARY KEY,
    "nome"              VARCHAR(255)  NOT NULL,
    "email"             VARCHAR(255)  NOT NULL UNIQUE,
    "senha_hash"        VARCHAR(255)  NOT NULL,
    "papel"             SMALLINT      NOT NULL CHECK ("papel" IN (0,1)),
    "data_criacao"      TIMESTAMP     NOT NULL DEFAULT now(),
    "data_atualizacao"  TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Pedidos" (
    "id"                SERIAL        PRIMARY KEY,
    "Usuarios_id"       INTEGER       NOT NULL REFERENCES "Usuarios"("id"),
    "texto"             VARCHAR(255)  NOT NULL,
    "estado"            CHAR(1)       NOT NULL CHECK ("estado" IN ('a','f')),
    "url_imagem"        VARCHAR(255),
    "data_criacao"      TIMESTAMP     NOT NULL DEFAULT now(),
    "data_atualizacao"  TIMESTAMP     NOT NULL DEFAULT now()
);

INSERT INTO "Usuarios" ("nome", "email", "senha_hash", "papel") VALUES
('Usuário', 'user@user.com.br', 'usuario', 0),
('Admin',   'admin@admin.com.br', 'admin1', 1);