// Os Gatos Indicam - Indicações Manuais de Livros
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('form-preferencias');
  const rec = document.getElementById('recomendacoes');
  
  // Função para exibir loader
  function showLoader(msg){ 
    rec.innerHTML = '<div class="loader">' + (msg || 'Nossos gatos estão preparando suas indicações...') + '</div>'; 
  }
  
  // Função para exibir alertas
  function showAlert(msg){ 
    const a = document.createElement('div'); 
    a.className = 'alert'; 
    a.textContent = msg; 
    document.body.appendChild(a); 
    setTimeout(() => a.remove(), 4500); 
  }
  
  // Função para mostrar/ocultar loading no botão
  function toggleButtonLoading(show) {
    const button = document.querySelector('.primary');
    const buttonText = button.querySelector('.button-text');
    const buttonLoading = button.querySelector('.button-loading');
    
    if (show) {
      buttonText.style.display = 'none';
      buttonLoading.style.display = 'inline';
      button.disabled = true;
    } else {
      buttonText.style.display = 'inline';
      buttonLoading.style.display = 'none';
      button.disabled = false;
    }
  }

  // =============================================
  // 📚 BANCO DE DADOS DE LIVROS - ADICIONE SEUS LIVROS AQUI
  // =============================================
  
  const livrosPorGenero = {
    romance: [
      {
        titulo: "É Assim que Acaba",
        autor: "Colleen Hoover",
        capa: "imagens/livros/romance1.jpg",
        ano: 2022,
        paginas: 368,
        descricao: "Um romance emocionante sobre relacionamentos tóxicos e redenção.",
        indicacao: {
          foto: "imagens/gatos/gato-romance.jpg",
          texto: "Miau! Este livro me fez ronronar de emoção! Perfeito para quem gosta de histórias que mexem com o coração. A evolução da personagem principal é simplesmente incrível! 🐱❤️"
        }
      }
      // ADICIONE MAIS LIVROS AQUI
    ],
    
    ficcao: [
      {
        titulo: "A Vida Invisível de Addie Larue",
        autor: "V.E. Schwab",
        capa: "imagens/livros/ficcao1.jpg",
        ano: 2020,
        paginas: 448,
        descricao: "Uma mulher faz um pacto para viver para sempre, mas é esquecida por todos que conhece.",
        indicacao: {
          foto: "imagens/gatos/gato-ficcao.jpg",
          texto: "Miau! Esta história me fez pensar sobre o que realmente importa na vida. Perfeito para quem gosta de ficção com alma! 🐱📖"
        }
      }
      // ADICIONE MAIS LIVROS AQUI
    ],
    
    'nao-ficcao': [
      {
        titulo: "Hábitos Atômicos",
        autor: "James Clear",
        capa: "imagens/livros/naoficcao1.jpg",
        ano: 2018,
        paginas: 320,
        descricao: "Um guia para construir bons hábitos e se livrar dos maus.",
        indicacao: {
          foto: "imagens/gatos/gato-naoficcao.jpg",
          texto: "Ronron! Este livro me ensinou a ter hábitos melhores - até minha rotina de sonecas melhorou! Ideal para quem quer crescer pessoalmente. 🐱🌟"
        }
      }
      // ADICIONE MAIS LIVROS AQUI
    ],
    
    terror: [
      {
        titulo: "O Iluminado",
        autor: "Stephen King",
        capa: "imagens/livros/terror1.jpg",
        ano: 1977,
        paginas: 447,
        descricao: "Uma família se muda para um hotel isolado durante o inverno, onde forças sobrenaturais os assombram.",
        indicacao: {
          foto: "imagens/gatos/gato-terror.jpg",
          texto: "Miau! Este livro me fez pular do sofá! Perfeito para noites chuvosas - mas talvez você queira ler com as luzes acesas! 🐱👻"
        }
      }
      // ADICIONE MAIS LIVROS AQUI
    ],
    
    fantasia: [
      {
        titulo: "O Nome do Vento",
        autor: "Patrick Rothfuss",
        capa: "imagens/livros/fantasia1.jpg",
        ano: 2007,
        paginas: 662,
        descricao: "A história de Kvothe, um homem lendário contando sua própria história.",
        indicacao: {
          foto: "imagens/gatos/gato-fantasia.jpg",
          texto: "Miau! Um mundo de fantasia tão rico que até eu me imaginei caçando dragões! Perfeito para escapismo de qualidade. 🐱🐉"
        }
      }
      // ADICIONE MAIS LIVROS AQUI
    ]
  };

  if(!form) return;
  
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    
    // Coletar dados do formulário
    const genres = [...document.querySelectorAll('input[name="genero"]:checked')].map(i => i.value);
    const authorsInput = document.getElementById('autores') ? document.getElementById('autores').value : '';
    const authors = authorsInput.split(',').map(s => s.trim()).filter(Boolean);
    const formats = [...document.querySelectorAll('input[name="formato"]:checked')].map(i => i.value);
    
    // Validação
    if(genres.length === 0){ 
      showAlert('Selecione ao menos um gênero para ver as indicações.'); 
      return; 
    }
    
    // Exibir loader
    showLoader('Nossos gatos estão escolhendo os melhores livros para você...');
    toggleButtonLoading(true);
    
    // Limpar recomendações anteriores
    rec.innerHTML = '';
    const grid = document.createElement('div'); 
    grid.className = 'recs'; 
    rec.appendChild(grid);
    
    // Simular um pequeno delay para melhor experiência
    setTimeout(() => {
      try {
        let totalLivros = 0;
        const livrosSelecionados = [];
        
        // Selecionar livros baseado nos gêneros escolhidos
        genres.forEach(genero => {
          if (livrosPorGenero[genero]) {
            // Adicionar até 3 livros de cada gênero selecionado
            const livrosDoGenero = livrosPorGenero[genero].slice(0, 3);
            livrosSelecionados.push(...livrosDoGenero);
            totalLivros += livrosDoGenero.length;
          }
        });
        
        // Se o usuário mencionou autores, priorizar livros desses autores
        if (authors.length > 0) {
          livrosSelecionados.sort((a, b) => {
            const aTemAutor = authors.some(autor => 
              a.autor.toLowerCase().includes(autor.toLowerCase())
            );
            const bTemAutor = authors.some(autor => 
              b.autor.toLowerCase().includes(autor.toLowerCase())
            );
            return bTemAutor - aTemAutor;
          });
        }
        
        // Mensagem se não encontrar livros
        if (totalLivros === 0) {
          grid.innerHTML = `
            <div class="no-results">
              <h3>Ops! Nossos gatos ainda não têm indicações para esses gêneros</h3>
              <p>Mas eles estão sempre lendo e em breve terão mais recomendações para você!</p>
              <button onclick="location.reload()" class="primary" style="margin-top: 12px;">Tentar Outros Gêneros</button>
            </div>
          `;
        } else {
          // Adicionar cabeçalho com resultados
          const resultsHeader = document.createElement('div');
          resultsHeader.className = 'results-header';
          resultsHeader.innerHTML = `
            <h3>🎉 Nossos gatos escolheram ${totalLivros} livros especiais para você!</h3>
            <p>Baseado nas suas preferências de ${genres.join(', ')}${authors.length > 0 ? ` e autores como ${authors.slice(0, 2).join(', ')}` : ''}${formats.length > 0 ? ` - Formatos preferidos: ${formats.map(f => {
              if (f === 'fisico') return '📚 Físico';
              if (f === 'digital') return '📱 Digital';
              if (f === 'audio') return '🎧 Audiolivro';
              return f;
            }).join(', ')}` : ''}</p>
          `;
          grid.appendChild(resultsHeader);
          
          // Criar cards para cada livro
          livrosSelecionados.forEach(livro => {
            const card = document.createElement('div'); 
            card.className = 'book-card';
            
            // Card da capa do livro
            const coverCard = document.createElement('div');
            coverCard.className = 'book-card-inner';
            coverCard.innerHTML = `
              <div class="book-cover">
                <img src="${livro.capa}" alt="${livro.titulo}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmY3ZmIiLz48dGV4dCB4PSIxMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9Ik51bml0byIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzViMWVhNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2FwYSBkbyBMaXZybzwvdGV4dD48L3N2Zz4='">
              </div>
              <div class="book-info">
                <h4>${livro.titulo}</h4>
                <p class="book-authors"><strong>${livro.autor}</strong></p>
                <p class="book-meta">
                  <span>${livro.ano}</span>
                  ${livro.paginas ? `<span>${livro.paginas} páginas</span>` : ''}
                </p>
                <p class="book-description">${livro.descricao}</p>
              </div>
            `;
            
            // Card da indicação dos Gatos
            const gatosCard = document.createElement('div');
            gatosCard.className = 'gatos-indication';
            gatosCard.innerHTML = `
              <div class="gatos-header">
                <img src="${livro.indicacao.foto}" alt="Os Gatos Indicam" class="gatos-photo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiBmaWxsPSIjZjRjNTQyIi8+PHBhdGggZD0iTTIwIDMwIFEzMCAyMCA0MCAzMCBRNTAgNDAgNDAgMzBaIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMyIgZmlsbD0iIzVhMWVhNiIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iMjUiIHI9IjMiIGZpbGw9IiM1YTFlYTYiLz48L3N2Zz4='">
                <div class="gatos-text">
                  <h4>🐱 Os Gatos Indicam!</h4>
                  <p>${livro.indicacao.texto}</p>
                </div>
              </div>
            `;
            
            // Container principal do livro
            const livroContainer = document.createElement('div');
            livroContainer.className = 'livro-completo';
            livroContainer.appendChild(coverCard);
            livroContainer.appendChild(gatosCard);
            
            card.appendChild(livroContainer);
            grid.appendChild(card);
          });
        }
        
      } catch(err) { 
        console.error('Erro:', err); 
        grid.innerHTML = `
          <div class="error-message">
            <h3>Ops! Algo deu errado</h3>
            <p>Nossos gatos estão tendo problemas para mostrar suas indicações. Tente novamente mais tarde.</p>
            <button onclick="location.reload()" class="primary" style="margin-top: 12px;">Tentar Novamente</button>
          </div>
        `;
      } finally {
        toggleButtonLoading(false);
      }
    }, 1000); // Pequeno delay para melhor UX
  });
});