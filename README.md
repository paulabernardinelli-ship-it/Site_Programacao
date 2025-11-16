README - Os Gatos Indicam

Descrição do Projeto
Os Gatos Indicam é um site de recomendação literária com uma abordagem única e encantadora: nossa equipe felina especializada em literatura seleciona livros personalizados baseados nas preferências dos usuários. O projeto combina um design acolhedor com funcionalidades interativas para criar uma experiência de descoberta literária memorável.

Funcionalidades Principais
Páginas do Site
Início (index.html): Apresentação do conceito com design atrativo

Cadastro (cadastro.html): Formulário completo com validação e integração ViaCEP

Preferências (produtos.html): Configuração de gostos literários para recomendações personalizadas

Contato (contato.html): Formulário de contato funcional

Sobre (sobre.html): Informações sobre a equipe e metodologia

Recursos Técnicos
Design Responsivo: Adaptável a todos os dispositivos

Validação de Formulários: Feedback em tempo real

Integração ViaCEP: Preenchimento automático de endereço

Sistema de Recomendações: Banco de dados com +15 livros categorizados

Animações CSS: Experiência visual suave e atrativa

Tecnologias Utilizadas
HTML5: Estrutura semântica

CSS3: Design moderno com variáveis CSS e animações

JavaScript: Interatividade e manipulação de dados

Google Fonts: Tipografia (Nunito + Cormorant Garamond)

ViaCEP API: Integração para busca de endereços

Design System
Cores Principais
Marrom Saddle (#8B4513): Cor de destaque

Verde Suave (#A3BE8C): Botões e elementos interativos

Bege Claro (#FFF8F0): Fundo principal

Marrom Chocolate (#2F1B0C): Texto principal

Tipografia
Nunito: Texto geral e interface

Cormorant Garamond: Títulos e elementos destacados

Estrutura de Arquivos
os-gatos-indicam/
│
├── index.html          # Página inicial
├── cadastro.html       # Formulário de cadastro
├── produtos.html       # Preferências e recomendações
├── contato.html        # Página de contato
├── sobre.html          # Sobre o projeto
├── style.css           # Estilos principais
├── script.js           # Script para cadastro/ViaCEP
├── script-manual.js    # Sistema de recomendações
└── img/               # Diretório de imagens
    ├── Gatos.png      # Imagem principal
    ├── gato1.png      # Fotos dos gatos
    ├── gato2.png
    ├── ...
    └── capas-livros/  # Capas dos livros recomendados

Como Executar
Clone o repositório:

git clone https://github.com/seu-usuario/os-gatos-indicam.git

Abra o projeto:

Navegue até a pasta do projeto

Abra index.html em seu navegador

Ou sirva com um servidor local:
# Com Node.js
npx http-server

Sistema de Recomendações
Gêneros Disponíveis
Romance

Ficção

Não-Ficção

Terror/Suspense

Fantasia

Como Funciona
Usuário seleciona gêneros preferidos

Sistema filtra livros por gênero

Cada recomendação inclui:

Capa do livro

Informações detalhadas

Indicação personalizada de um gato

Metadados (ano, páginas, descrição)

Responsividade
O site é totalmente responsivo, adaptando-se a:

Desktop (1200px+)

Tablet (768px - 1199px)

Mobile (até 767px)

Personalização
Adicionar Novos Livros
Edite script-manual.js na seção livrosPorGenero:
const livrosPorGenero = {
  seu_genero: 
 
  const livrosPorGenero = {
  seu_genero: [
    {
      titulo: "Novo Livro",
      autor: "Autor",
      capa: "img/capa.png",
      ano: 2024,
      paginas: 300,
      descricao: "Descrição do livro",
      indicacao: {
        foto: "img/gatoX.png",
        texto: "Recomendação do gato"
      }
    }
  ]
}

Desenvolvido com ❤️ e muito ronronar pela equipe felina dos Gatos Indicam 🐾











