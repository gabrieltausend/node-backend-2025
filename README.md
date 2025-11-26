# Site para AC Projetos e Construções

## 1) Problema
- O cliente e o arquiteto, em ocasioões diferentes para cada, tem dificuldade em entrarem em contato um com o outro.
- Isso causa conflitos entre cliente-servidor, na qual, muitas das vezes ambos tem dificuldade de entrarem em contato um com o outro por choques de agenda ou falta de atenção por parte de algum deles.
- No início, o foco será em ajudar o cliente com o objetivo de facilitar seu contato com o arquiteto e auxiliar o arquiteto com seu trabalho.

## 2) Atores e Decisores
- Usuários principais: Cliente, Arquiteto;
- Decisores/Apoiadores: Estagiário do Arquiteto.

## 3) Casos de uso (de forma simples) 
- Cliente: Ver os trabalhos do Arquiteto, Entrar em contato com o Estagiário para tirar dúvidas ou pedir contato direto com o Arquiteto;
- Arquiteto: Login, Manter Conectado, Manter (inserir, mostrar, editar, remover) trabalhos e projetos no repositório, Agendar e gerenciar reuniões;
- Estagiário: Login, Manter conectado, Participar das reuniões do Arquiteto, Entrar em contato com o Cliente para responde-lo.

## 4) Limites e suposições
- Limites: Entrega final até o fim da disciplina (ex.: 30/11/2025), Rodar em navegadores de dispositivos móveis e computadores, Sem serviços pagos;
- Suposições: Cadastro para contato, 10 min para teste rápido;
- Plano B: Deixar o números de telefone e e-mail disponíveis para contato.

## 5) Hipóteses + validação
- Valor: Se o cliente entrar em contato com o estagiário, então ele consegue fechar negócio com mais facilidade junto do arquiteto.  
- Validação (valor): Teste de contato entre Estagiári e Cliente; alvo: Chat de contato funcionar.

- Viabilidade: Caso do Arquiteto resolver lançar trabalhos e projetos ao repositório.  
- Validação (viabilidade): Lançamento de imagens ao repositório; Meta: Ter ao menos 5 imagens de projetos ou trabalhos lançados no repositório do site.

## 6) Fluxo principal e primeira/segunda fatia
**Fluxo principal:**  
1) Cliente acessa o site
2) Analisa o repositório
3) Caso de dúvida entrar em contato com o Estagiário
4) Utilizar a aba de contato para conversar e negociar com o Arquiteto.
**Primeira fatia vertical:**  
Inclui: Login simples, abrir chat para contato, Participar de reuniões.  
Critérios de aceite:
1) Estagiário acessa o site
2) Realiza o login
3) Entra em contato com o Cliente
4) Participa da reunião com o Arquiteto.
**Segunda fatia vertical:**
Inclui: Login simples, criar reunião, lançamento de imagens ao repositório
Critérios de aceite:
1) Arquiteto acessa o site
2) Realiza o login
3) Cria uma reunião
4) Lança trabalhos e projetos do repositório

## 7) Esboços de algumas telas (wireframes)
<!-- Vale desenho no papel (foto), Figma, Excalidraw, etc. Não precisa ser bonito, precisa ser claro.
     EXEMPLO de telas:
     • Login
     • Lista de chamados (ordem + tempo desde criação)
     • Novo chamado (formulário simples)
     • Painel do professor (atender/encerrar)
     EXEMPLO de imagem:
     ![Wireframe - Lista de chamados](img/wf-lista-chamados.png) -->
[Links ou imagens dos seus rascunhos de telas aqui]

## 8) Tecnologias
- JavaScript: p/ o front-end e back-end (Express)
- No Navegador: HTML + CSS + JS + Bootstrap

### 8.1 Navegador
**Navegador:** HTML/CSS/JS/Bootstrap  
**Armazenamento local (se usar):**
**Hospedagem:** Github Pages e acprojeto.com.br

### 8.2 Front-end (servidor de aplicação, se existir)
**Front-end (servidor):** React 
**Hospedagem:** Github Pages

### 8.3 Back-end (API/servidor, se existir)
**Back-end (API):** JavaScript com Express
**Banco de dados:** MySQL ou Postgres
**Deploy do back-end:** Estudar onde fazer

## 9) Plano de Dados (Dia 0) — somente itens 1–3
<!-- Defina só o essencial para criar o banco depois. -->

### 9.1 Entidades
- [Usuário] — [pessoa que usa o sistema (cliente, arquiteto, estagiário)]
- [Chat] — [chat de conversa entre cliente e estagiario]
- [Reunião] — [reunião criada pelo arquiteto]
- [Repositório] — [repositório de trabalhos do arquiteto]

### 9.2 Campos por entidade

### Usuario
| Campo           | Tipo                             | Obrigatório | Exemplo            |
|-----------------|----------------------------------|-------------|--------------------|
| id              | número                           | sim         | 1                  |
| nome            | texto                            | sim         | "Anderson"         |
| email           | texto                            | sim (único) | "estag@ac.com"     |
| senha_hash      | texto                            | sim         | "senhaex..."       |
| papel           | número (0=cliente, 1=estagiario) | sim         | 1                  |
| dataCriacao     | data/hora                        | sim         | 2025-08-20 14:30   |
| dataAtualizacao | data/hora                        | sim         | 2025-08-20 15:10   |

### Chat
| Campo           | Tipo               | Obrigatório | Exemplo                 |
|-----------------|--------------------|-------------|-------------------------|
| id              | número             | sim         | 2                       |
| Chat_id         | int (fk)           | sim         | 8f3a-...                |
| erro            | texto              | sim         | "Erro ao compilar"      |
| texto           | texto              | sim         | 'boa tarde'             |
| dataInicio      | data/hora          | sim         | 2025-08-20 14:35        |
| dataFim         | data/hora          | sim         | 2025-08-20 15:50        |

### Reunião
| Campo           | Tipo               | Obrigatório | Exemplo                 |
|-----------------|--------------------|-------------|-------------------------|
| id              | número             | sim         | 2                       |
| Reuniao_id      | char (fk)          | sim         | 8f3a-...                |
| erro            | texto              | sim         | "Erro ao compilar"      |
| dataCriacao     | data/hora          | sim         | 2025-08-20 17:30        |
| dataFim         | data/hora          | sim         | 2025-08-20 18:40        |

### Repositório
| Campo           | Tipo               | Obrigatório | Exemplo                 |
|-----------------|--------------------|-------------|-------------------------|
| id              | número             | sim         | 2                       |
| Repositorio_id  | char (fk)          | sim         | 8f3a-...                |
| erro            | texto              | sim         | "Erro ao compilar"      |
| nome            | texto              | sim         | "exemplo.png"           |
| dataCriacao     | data/hora          | sim         | 2025-08-20 13:55        |

### 9.3 Relações entre entidades
- Um Usuario tem muitos Repositórios. (1→N)
- Um Chat pertence a um Usuário. (N→1)
- Uma Reunião tem muitos Usuários. (N→1)
- Um Usuário tem muitos Chats. (1→N)

### 9.4 Modelagem do Banco de Dados

~~~
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    papel SMALLINT NOT NULL CHECK (papel IN (0, 1)), -- 0=cliente, 1=estagiario
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL
);

CREATE TABLE mensagens_chat (
    id SERIAL PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    erro TEXT NOT NULL,
    texto TEXT NOT NULL
);

CREATE TABLE reunioes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    data_criacao TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL
);

CREATE TABLE registros_reuniao (
    id SERIAL PRIMARY KEY,
    reuniao_id UUID NOT NULL REFERENCES reunioes(id) ON DELETE CASCADE,
    erro TEXT NOT NULL
);

CREATE TABLE repositorios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    data_criacao TIMESTAMP NOT NULL
);

CREATE TABLE arquivos_repositorio (
    id SERIAL PRIMARY KEY,
    repositorio_id UUID NOT NULL REFERENCES repositorios(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    erro TEXT NOT NULL
);

INSERT INTO usuarios (nome, email, senha_hash, papel)
VALUES ('Anderson', 'estag@ac.com', 'senhaex123hash', 1);

INSERT INTO chats (usuario_id, data_inicio, data_fim)
VALUES (
    1,
    '2025-08-20 14:35',
    '2025-08-20 15:50'
);

INSERT INTO mensagens_chat (chat_id, erro, texto)
VALUES (
    '8f3a0000-0000-0000-0000-000000000001', -- substitua com o UUID real do chat
    'Erro ao compilar',
    'Boa tarde'
);

INSERT INTO reunioes (id, usuario_id, data_criacao, data_fim)
VALUES (
    '8f3a0000-0000-0000-0000-000000000002',
    1,
    '2025-08-20 17:30',
    '2025-08-20 18:40'
);

INSERT INTO registros_reuniao (reuniao_id, erro)
VALUES (
    '8f3a0000-0000-0000-0000-000000000002',
    'Erro ao compilar'
);

SELECT 
    u.nome AS usuario,
    c.id AS chat_id,
    c.data_inicio,
    c.data_fim,
    m.texto,
    m.erro
FROM mensagens_chat m
JOIN chats c ON m.chat_id = c.id
JOIN usuarios u ON c.usuario_id = u.id
ORDER BY c.data_inicio;

~~~