-- =============================================
-- OS GATOS INDICAM - BANCO DE DADOS
-- Banco: fatec-2025
-- =============================================

-- 🗂️ VERIFICAR SE ESTAMOS NO BANCO CORRETO
SELECT DB_NAME() AS 'Database em uso';

-- =============================================
-- 📊 TABELAS PRINCIPAIS
-- =============================================

-- 👥 TABELA DE USUÁRIOS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) UNIQUE NOT NULL,
        idade INT NOT NULL CHECK (idade >= 12 AND idade <= 120),
        telefone NVARCHAR(20),
        cep NVARCHAR(9) NOT NULL,
        logradouro NVARCHAR(255) NOT NULL,
        numero NVARCHAR(10) NOT NULL,
        complemento NVARCHAR(100),
        bairro NVARCHAR(100) NOT NULL,
        cidade NVARCHAR(100) NOT NULL,
        estado NVARCHAR(2) NOT NULL,
        data_cadastro DATETIME2 DEFAULT GETDATE(),
        ativo BIT DEFAULT 1
    );
    PRINT '✅ Tabela usuarios criada com sucesso!';
END
ELSE
BEGIN
    PRINT '⚠️  Tabela usuarios já existe';
END

-- 📚 TABELA DE PREFERÊNCIAS LITERÁRIAS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='preferencias' AND xtype='U')
BEGIN
    CREATE TABLE preferencias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT FOREIGN KEY REFERENCES usuarios(id),
        generos NVARCHAR(MAX), -- JSON array: ['romance', 'ficcao', ...]
        autores_favoritos NVARCHAR(500),
        frequencia_leitura NVARCHAR(20) CHECK (frequencia_leitura IN ('diariamente', 'semanalmente', 'mensalmente', 'raramente')),
        horario_preferido NVARCHAR(20) CHECK (horario_preferido IN ('manha', 'tarde', 'noite', 'madrugada')),
        livros_mes NVARCHAR(10) CHECK (livros_mes IN ('1-2', '3-4', '5+', 'varia')),
        formatos_preferidos NVARCHAR(MAX), -- JSON array: ['fisico', 'digital', 'audio']
        descricao NVARCHAR(1000),
        data_atualizacao DATETIME2 DEFAULT GETDATE()
    );
    PRINT '✅ Tabela preferencias criada com sucesso!';
END
ELSE
BEGIN
    PRINT '⚠️  Tabela preferencias já existe';
END

-- 📖 TABELA DE LIVROS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='livros' AND xtype='U')
BEGIN
    CREATE TABLE livros (
        id INT IDENTITY(1,1) PRIMARY KEY,
        titulo NVARCHAR(255) NOT NULL,
        autor NVARCHAR(255) NOT NULL,
        descricao NVARCHAR(MAX),
        capa_url NVARCHAR(500),
        ano_publicacao INT,
        paginas INT,
        genero NVARCHAR(50) NOT NULL,
        nota_media DECIMAL(3,2) DEFAULT 0,
        total_avaliacoes INT DEFAULT 0,
        data_cadastro DATETIME2 DEFAULT GETDATE()
    );
    PRINT '✅ Tabela livros criada com sucesso!';
END
ELSE
BEGIN
    PRINT '⚠️  Tabela livros já existe';
END

-- 🐱 TABELA DE GATOS (Nossa equipe felina!)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gatos' AND xtype='U')
BEGIN
    CREATE TABLE gatos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(100) NOT NULL,
        foto_url NVARCHAR(500),
        especialidade NVARCHAR(100),
        descricao NVARCHAR(500),
        ativo BIT DEFAULT 1
    );
    PRINT '✅ Tabela gatos criada com sucesso!';
END
ELSE
BEGIN
    PRINT '⚠️  Tabela gatos já existe';
END

-- 💬 TABELA DE INDICAÇÕES DOS GATOS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gatos_indicacoes' AND xtype='U')
BEGIN
    CREATE TABLE gatos_indicacoes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        gato_id INT FOREIGN KEY REFERENCES gatos(id),
        livro_id INT FOREIGN KEY REFERENCES livros(id),
        texto_indicacao NVARCHAR(500) NOT NULL,
        data_indicacao DATETIME2 DEFAULT GETDATE()
    );
    PRINT '✅ Tabela gatos_indicacoes criada com sucesso!';
END
ELSE
BEGIN
    PRINT '⚠️  Tabela gatos_indicacoes já existe';
END

-- 📧 TABELA DE MENSAGENS DE CONTATO
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='contato_mensagens' AND xtype='U')
BEGIN
    CREATE TABLE contato_mensagens (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        telefone NVARCHAR(20),
        assunto NVARCHAR(50) NOT NULL,
        mensagem NVARCHAR(MAX) NOT NULL,
        data_envio DATETIME2 DEFAULT GETDATE(),
        status NVARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'respondida', 'arquivada')),
        resposta NVARCHAR(MAX),
        data_resposta DATETIME2
    );
    PRINT '✅ Tabela contato_mensagens criada com sucesso!';
END
ELSE
BEGIN
    PRINT '⚠️  Tabela contato_mensagens já existe';
END

-- ⭐ TABELA DE AVALIAÇÕES DE LIVROS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='avaliacoes' AND xtype='U')
BEGIN
    CREATE TABLE avaliacoes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT FOREIGN KEY REFERENCES usuarios(id),
        livro_id INT FOREIGN KEY REFERENCES livros(id),
        nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
        comentario NVARCHAR(1000),
        data_avaliacao DATETIME2 DEFAULT GETDATE(),
        UNIQUE(usuario_id, livro_id)
    );
    PRINT '✅ Tabela avaliacoes criada com sucesso!';
END
ELSE
BEGIN
    PRINT '⚠️  Tabela avaliacoes já existe';
END

-- =============================================
-- 🛠️ STORED PROCEDURES
-- =============================================

-- 👤 CADASTRAR USUÁRIO
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CadastrarUsuario')
    DROP PROCEDURE sp_CadastrarUsuario;
GO

CREATE PROCEDURE sp_CadastrarUsuario
    @nome NVARCHAR(100),
    @email NVARCHAR(255),
    @idade INT,
    @telefone NVARCHAR(20),
    @cep NVARCHAR(9),
    @logradouro NVARCHAR(255),
    @numero NVARCHAR(10),
    @complemento NVARCHAR(100),
    @bairro NVARCHAR(100),
    @cidade NVARCHAR(100),
    @estado NVARCHAR(2)
AS
BEGIN
    INSERT INTO usuarios (nome, email, idade, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado)
    VALUES (@nome, @email, @idade, @telefone, @cep, @logradouro, @numero, @complemento, @bairro, @cidade, @estado);
    
    SELECT SCOPE_IDENTITY() as id;
END;
GO
PRINT '✅ Stored Procedure sp_CadastrarUsuario criada!';

-- 💾 SALVAR PREFERÊNCIAS
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_SalvarPreferencias')
    DROP PROCEDURE sp_SalvarPreferencias;
GO

CREATE PROCEDURE sp_SalvarPreferencias
    @usuario_id INT,
    @generos NVARCHAR(MAX),
    @autores_favoritos NVARCHAR(500),
    @frequencia_leitura NVARCHAR(20),
    @horario_preferido NVARCHAR(20),
    @livros_mes NVARCHAR(10),
    @formatos_preferidos NVARCHAR(MAX),
    @descricao NVARCHAR(1000)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM preferencias WHERE usuario_id = @usuario_id)
    BEGIN
        UPDATE preferencias SET
            generos = @generos,
            autores_favoritos = @autores_favoritos,
            frequencia_leitura = @frequencia_leitura,
            horario_preferido = @horario_preferido,
            livros_mes = @livros_mes,
            formatos_preferidos = @formatos_preferidos,
            descricao = @descricao,
            data_atualizacao = GETDATE()
        WHERE usuario_id = @usuario_id;
    END
    ELSE
    BEGIN
        INSERT INTO preferencias (usuario_id, generos, autores_favoritos, frequencia_leitura, horario_preferido, livros_mes, formatos_preferidos, descricao)
        VALUES (@usuario_id, @generos, @autores_favoritos, @frequencia_leitura, @horario_preferido, @livros_mes, @formatos_preferidos, @descricao);
    END
END;
GO
PRINT '✅ Stored Procedure sp_SalvarPreferencias criada!';

-- 🎯 OBTER RECOMENDAÇÕES
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ObterRecomendacoes')
    DROP PROCEDURE sp_ObterRecomendacoes;
GO

CREATE PROCEDURE sp_ObterRecomendacoes
    @usuario_id INT
AS
BEGIN
    DECLARE @generos_preferidos NVARCHAR(MAX);
    
    SELECT @generos_preferidos = generos 
    FROM preferencias 
    WHERE usuario_id = @usuario_id;
    
    IF @generos_preferidos IS NOT NULL
    BEGIN
        SELECT TOP 10 
            l.*, 
            gi.texto_indicacao, 
            g.nome as gato_nome, 
            g.foto_url as gato_foto,
            g.especialidade as gato_especialidade
        FROM livros l
        INNER JOIN gatos_indicacoes gi ON l.id = gi.livro_id
        INNER JOIN gatos g ON gi.gato_id = g.id
        WHERE EXISTS (
            SELECT 1 
            FROM STRING_SPLIT(@generos_preferidos, ',') 
            WHERE value = l.genero
        )
        ORDER BY l.nota_media DESC, l.total_avaliacoes DESC;
    END
    ELSE
    BEGIN
        -- Se não tem preferências, retorna livros populares
        SELECT TOP 10 
            l.*, 
            gi.texto_indicacao, 
            g.nome as gato_nome, 
            g.foto_url as gato_foto,
            g.especialidade as gato_especialidade
        FROM livros l
        INNER JOIN gatos_indicacoes gi ON l.id = gi.livro_id
        INNER JOIN gatos g ON gi.gato_id = g.id
        ORDER BY l.nota_media DESC, l.total_avaliacoes DESC;
    END
END;
GO
PRINT '✅ Stored Procedure sp_ObterRecomendacoes criada!';

-- ✉️ SALVAR MENSAGEM DE CONTATO
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_SalvarMensagemContato')
    DROP PROCEDURE sp_SalvarMensagemContato;
GO

CREATE PROCEDURE sp_SalvarMensagemContato
    @nome NVARCHAR(100),
    @email NVARCHAR(255),
    @telefone NVARCHAR(20),
    @assunto NVARCHAR(50),
    @mensagem NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO contato_mensagens (nome, email, telefone, assunto, mensagem)
    VALUES (@nome, @email, @telefone, @assunto, @mensagem);
    
    SELECT SCOPE_IDENTITY() as id;
END;
GO
PRINT '✅ Stored Procedure sp_SalvarMensagemContato criada!';

-- 📈 OBTER LIVROS EM DESTAQUE
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ObterLivrosDestaque')
    DROP PROCEDURE sp_ObterLivrosDestaque;
GO

CREATE PROCEDURE sp_ObterLivrosDestaque
    @limit INT = 6
AS
BEGIN
    SELECT TOP (@limit) 
        l.*, 
        gi.texto_indicacao, 
        g.nome as gato_nome, 
        g.foto_url as gato_foto
    FROM livros l
    INNER JOIN gatos_indicacoes gi ON l.id = gi.livro_id
    INNER JOIN gatos g ON gi.gato_id = g.id
    ORDER BY NEWID(); -- Aleatório
END;
GO
PRINT '✅ Stored Procedure sp_ObterLivrosDestaque criada!';

-- =============================================
-- 🐱 DADOS INICIAIS
-- =============================================

-- INSERIR GATOS DA EQUIPE
IF NOT EXISTS (SELECT 1 FROM gatos)
BEGIN
    INSERT INTO gatos (nome, especialidade, descricao) VALUES
    ('Luna', 'Romance e Drama', 'Especialista em histórias que mexem com o coração'),
    ('Thor', 'Ficção Científica', 'Apaixonado por universos paralelos e futuros distantes'),
    ('Mimi', 'Fantasia', 'Especialista em mundos mágicos e criaturas fantásticas'),
    ('Oliver', 'Terror e Suspense', 'Mestre em histórias que dão arrepios'),
    ('Bella', 'Não-Ficção', 'Especialista em biografias e histórias reais');
    PRINT '✅ Dados dos gatos inseridos!';
END
ELSE
BEGIN
    PRINT '⚠️  Gatos já existem na base';
END

-- INSERIR LIVROS DE EXEMPLO
IF NOT EXISTS (SELECT 1 FROM livros)
BEGIN
    INSERT INTO livros (titulo, autor, descricao, genero, ano_publicacao, paginas, nota_media, total_avaliacoes) VALUES
    ('Atmosfera', 'Taylor Jenkins Reid', 'Um romance épico ambientado na Nasa dos anos 1980.', 'romance', 2025, 336, 4.5, 120),
    ('A Vida Invisível de Addie Larue', 'V.E. Schwab', 'Uma mulher faz um pacto para viver para sempre, mas é esquecida por todos que conhece.', 'ficcao', 2020, 448, 4.7, 89),
    ('Horror Noir', 'Robin R. Means Coleman', 'Análise da representação negra no cinema de terror.', 'nao-ficcao', 2020, 521, 4.3, 45),
    ('O Iluminado', 'Stephen King', 'Uma família se muda para um hotel isolado durante o inverno.', 'terror', 2012, 464, 4.8, 256),
    ('A Quinta Estação', 'N.K. Jemisin', 'Fantasia épica sobre opressão e o poder da Terra.', 'fantasia', 2017, 560, 4.6, 178),
    ('Nós Dois Sozinhos no Éter', 'Olivie Blake', 'Um romance sensível sobre amar por inteiro, mesmo estando aos pedaços.', 'romance', 2023, 336, 4.4, 92),
    ('Quando Havia Lobos', 'Charlotte McConaghy', 'Reintrodução de lobos nas Highlands escocesas e confronto com traumas pessoais.', 'ficcao', 2023, 364, 4.2, 67);
    PRINT '✅ Livros de exemplo inseridos!';
END
ELSE
BEGIN
    PRINT '⚠️  Livros já existem na base';
END

-- INSERIR INDICAÇÕES DOS GATOS
IF NOT EXISTS (SELECT 1 FROM gatos_indicacoes)
BEGIN
    INSERT INTO gatos_indicacoes (gato_id, livro_id, texto_indicacao) VALUES
    (1, 1, 'Miau! Este livro me fez ronronar de emoção! Perfeito para quem gosta de histórias que mexem com o coração. 🐱❤️'),
    (1, 6, 'Não é sobre ser perfeito. É sobre encontrar alguém que entenda seu olhar mais profundo, mesmo sem miar. 🐱💕'),
    (2, 2, 'Miau! Esta história me fez pensar sobre o que realmente importa na vida. Perfeito para quem gosta de ficção com alma! 🐱📖'),
    (2, 7, 'Será que um dia vão escrever "Quando Havia Gatos"? Leiam "Quando Havia Lobos". É sobre amar algo tão selvagem e frágil que pode sumir para sempre.'),
    (3, 5, 'Miau! Um mundo tão vibrante e único que até eu quis ter poderes para controlar as estações! Fantasia revolucionária. 🐱🌋'),
    (4, 4, 'Miau! Este livro me fez pular do sofá! Perfeito para noites chuvosas - mas talvez você queira ler com as luzes acesas! 🐱👻'),
    (5, 3, 'Miau! Este livro abriu meus olhos felinos para a importância da representação no terror. Leitura essencial para cinéfilos! 🐱🎬');
    PRINT '✅ Indicações dos gatos inseridas!';
END
ELSE
BEGIN
    PRINT '⚠️  Indicações já existem na base';
END

-- =============================================
-- 📊 ÍNDICES PARA PERFORMANCE
-- =============================================

-- ÍNDICE PARA USUÁRIOS
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_usuarios_email')
    CREATE INDEX idx_usuarios_email ON usuarios(email);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_usuarios_data_cadastro')
    CREATE INDEX idx_usuarios_data_cadastro ON usuarios(data_cadastro);

-- ÍNDICES PARA LIVROS
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_livros_genero')
    CREATE INDEX idx_livros_genero ON livros(genero);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_livros_autor')
    CREATE INDEX idx_livros_autor ON livros(autor);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_livros_nota')
    CREATE INDEX idx_livros_nota ON livros(nota_media DESC);

-- ÍNDICES PARA PREFERÊNCIAS
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_preferencias_usuario')
    CREATE INDEX idx_preferencias_usuario ON preferencias(usuario_id);

-- ÍNDICES PARA AVALIAÇÕES
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_avaliacoes_livro')
    CREATE INDEX idx_avaliacoes_livro ON avaliacoes(livro_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_avaliacoes_usuario')
    CREATE INDEX idx_avaliacoes_usuario ON avaliacoes(usuario_id);

PRINT '✅ Índices de performance criados!';

-- =============================================
-- ✅ RELATÓRIO FINAL
-- =============================================

PRINT '=============================================';
PRINT '🐱 OS GATOS INDICAM - BANCO CONFIGURADO!';
PRINT '=============================================';
PRINT '📊 TABELAS CRIADAS:';
PRINT '   👥 usuarios';
PRINT '   📚 preferencias'; 
PRINT '   📖 livros';
PRINT '   🐱 gatos';
PRINT '   💬 gatos_indicacoes';
PRINT '   📧 contato_mensagens';
PRINT '   ⭐ avaliacoes';
PRINT '';
PRINT '🛠️  STORED PROCEDURES:';
PRINT '   👤 sp_CadastrarUsuario';
PRINT '   💾 sp_SalvarPreferencias';
PRINT '   🎯 sp_ObterRecomendacoes';
PRINT '   ✉️  sp_SalvarMensagemContato';
PRINT '   📈 sp_ObterLivrosDestaque';
PRINT '';
PRINT '🐱 DADOS INICIAIS:';
PRINT '   5 gatos especialistas';
PRINT '   7 livros de exemplo';
PRINT '   7 indicações dos gatos';
PRINT '';
PRINT '✅ BANCO fatec-2025 CONFIGURADO COM SUCESSO!';
PRINT '=============================================';