// Indicações Manuais de Livros
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('form-preferencias');
  const rec = document.getElementById('recomendacoes');
  
  // Função para exibir loader
  function showLoader(msg){ 
    rec.innerHTML = '<div class="loader">' + (msg || 'Nossos gatos estão preparando suas indicações...') + '</div>'; 
  }
  
  // Função para exibir alertas
  function showAlert(msg, type = 'info'){ 
    const a = document.createElement('div'); 
    a.className = `alert ${type}`; 
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
        titulo: "Atmosfera",
        autor: "Taylor Jenkins Reid",
        capa: "img/Atmosfera.png",
        ano: 2025,
        paginas: 336,
        descricao: "Um romance épico ambientado na Nasa dos anos 1980.",
        indicacao: {
          foto: "img/gato1.png",
          texto: "Miau! Este livro me fez ronronar de emoção! Perfeito para quem gosta de histórias que mexem com o coração. 🐱❤️"
        }
      },
      {
        titulo: "Nós Dois Sozinhos no Éter",
        autor: "Olivie Blake",
        capa: "img/Nos-dois.png",
        ano: 2023,
        paginas: 336,
        descricao: "Um romance sensível e arrebatador sobre amar por inteiro, mesmo estando aos pedaços.",
        indicacao: {
          foto: "img/gato2.png",
          texto: "Não é sobre ser perfeito. É sobre encontrar alguém que entenda seu olhar mais profundo, mesmo sem miar. 'Nós Dois Sozinhos no Éter' é isso. 🐱💕"
        }
      },
      {
        titulo: "GOLEM E O GÊNIO",
        autor: "Helene Wecker",
        capa: "img/Golem.png",
        ano: 2020,
        paginas: 520,
        descricao: "Em plena Nova York na virada do século XX, este romance fantástico une duas almas mitológicas: Chava, uma Golem do folclore judaico, e Ahmad, um Gênio (Djim) do deserto sírio. É uma fábula moderna e delicada que explora temas de identidade e o encontro improvável de culturas distintas em meio à vida de imigrantes.",
        indicacao: {
          foto: "img/gato3.png",
          texto: "Ronronar de aprovação para 'Golem e o Gênio'. Trata da magia de existir entre dois extremos. Assim como eu, que existo entre a elegância suprema e a derrubada calculista de objetos."
        }
      }
    ],
    
    ficcao: [
      {
        titulo: "A Vida Invisível de Addie Larue",
        autor: "V.E. Schwab",
        capa: "img/A-Vida-Invisível-de-Addie-Larue.jpg",
        ano: 2020,
        paginas: 448,
        descricao: "Uma mulher faz um pacto para viver para sempre, mas é esquecida por todos que conhece.",
        indicacao: {
          foto: "img/gato12.png",
          texto: "Miau! Esta história me fez pensar sobre o que realmente importa na vida. Perfeito para quem gosta de ficção com alma! 🐱📖"
        }
      },
      {
        titulo: "Quando Havia Lobos",
        autor: "Charlotte McConaghy",
        capa: "img/Quando-havia-lobos.png",
        ano: 2023,
        paginas: 364,
        descricao: "Acompanhamos Inti Flynn enquanto ela tenta reintroduzir lobos nas Highlands escocesas, enfrentando a hostilidade dos moradores e os próprios traumas; quando um homem da região desaparece, a tensão cresce, misturando mistério, dor antiga e a esperança de cura que nasce da convivência entre humanos e animais.",
        indicacao: {
          foto: "img/gato4.png",
          texto: "Será que um dia vão escrever 'Quando Havia Gatos'? A humana fecha o livro e me olha... talvez ela também tema essa resposta. Leiam 'Quando Havia Lobos'. É sobre amar algo tão selvagem e frágil que pode sumir para sempre."
        }
      },
      {
        titulo: "Nada Para Ver Aqui",
        autor: "Kevin Wilson",
        capa: "img/Nada-para-ver-aqui.png",
        ano: 2022,
        paginas: 272,
        descricao: "Lilian, uma babá improvável, encontra significado na vida ao cuidar de duas crianças que, literalmente, entram em combustão espontânea quando ficam agitadas.",
        indicacao: {
          foto: "img/gato5.png",
          texto: "Crianças que pegam fogo? Nada demais. Só não pode ser mais estranho do que eu encarando a parede por meia hora vendo fantasmas que só eu consigo enxergar. 🐱"
        }
      }
    ],
    
    'nao-ficcao': [
      {
        titulo: "Horror Noir: A Representação Negra no Cinema de Terror",
        autor: "Robin R. Means Coleman",
        capa: "img/Horror.png",
        ano: 2020,
        paginas: 521,
        descricao: "Uma análise profunda da representação de personagens negros no cinema de terror e horror.",
        indicacao: {
         foto: "img/gato7.png",
         texto: "Miau! Este livro abriu meus olhos felinos para a importância da representação no terror. Leitura essencial para cinéfilos! 🐱🎬"
        }
      },
      {
        titulo: "Na Casa dos Sonhos",
        autor: "Carmen Maria Machado",
        capa: "img/Na-casa.png",
        ano: 2021,
        paginas: 360,
        descricao: "Memórias em forma de ensaios que exploram relacionamentos abusivos através de referências à cultura pop e terror.",
        indicacao: {
         foto: "img/gato8.png",
         texto: "Ronron... Uma obra corajosa que me fez refletir sobre as casas que habitamos - físicas e emocionais. Profundo e necessário. 🐱🏠"
        }
      },
      {
        titulo: "Sobre a Escrita",
        autor: "Stephen King",
        capa: "img/Sobre-a-escrita.png",
        ano: 2015,
        paginas: 256,
        descricao: "Parte memória, parte manual, um guia indispensável para aspirantes a escritores e fãs de literatura.",
        indicacao: {
          foto: "img/gato9.png",
          texto: "Miau! Até eu fiquei com vontade de escrever minhas memórias felinas depois deste livro! Inspirador e prático. 🐱✍️"
        }
      }
    ],
    
    terror: [
      {
        titulo: "O Iluminado",
        autor: "Stephen King",
        capa: "img/O-Iluminado.jpg",
        ano: 2012,
        paginas: 464,
        descricao: "Uma família se muda para um hotel isolado durante o inverno, onde forças sobrenaturais os assombram.",
        indicacao: {
          foto: "img/gato12.png",
          texto: "Miau! Este livro me fez pular do sofá! Perfeito para noites chuvosas - mas talvez você queira ler com as luzes acesas! 🐱👻"
        }
      },
      {
        titulo: "Nós Já Moramos Aqui",
        autor: "Marcus Kliewer",
        capa: "img/Nos-ja.png",
        ano: 2025,
        paginas: 320,
        descricao: "Uma história perturbadora sobre uma casa que guarda segredos sombrios e memórias que se recusam a desaparecer.",
        indicacao: {
          foto: "img/gato10.png",
          texto: "MIAU! Este livro me fez ver sombras em cada canto da casa! Perfeito para quem gosta de terror psicológico e atmosférico. 🐱🏚️"
        }
      },
      {
        titulo: "Nós Nos Espalhamos",
        autor: "Iain Reid",
        capa: "img/Nos-nos-espalhamos.png",
        ano: 2023,
        paginas: 242,
        descricao: "Uma artista idosa enviada para uma casa de repouso isolada onde as coisas começam a escapar de seu controle. À medida que o tempo se confunde e a memória falha, ela precisa descobrir se está sucumbindo aos efeitos da velhice ou se é participante involuntária de algo muito mais sinistro e perturbador.",
        indicacao: {
         foto: "img/gato1.png",
         texto: "Ronron... Uma narrativa que se espalha pela mente como uma teia de aranha. Assustadoramente profundo e inquietante! 🐱🕸️"
        }
      }
    ],
    
    fantasia: [
      {
         titulo: "A Quinta Estação",
         autor: "N.K. Jemisin",
         capa: "img/A-quinta.png",
         ano: 2017,
         paginas: 560,
         descricao: "O livro segue as jornadas interligadas de três mulheres Orogenes, explorando temas de opressão, racismo estrutural e o poder destrutivo e criativo da Terra. É uma fantasia épica, brutal e extremamente original.",
         indicacao: {
          foto: "img/gato2.png",
          texto: "Miau! Um mundo tão vibrante e único que até eu quis ter poderes para controlar as estações! Fantasia revolucionária. 🐱🌋"
        }
      },
      {
        titulo: "Mistborn",
        autor: "Brandon Sanderson",
        capa: "img/Mistborn.png",
        ano: 2025,
        paginas: 716,
        descricao: "Num mundo onde a cinzas caem do céu, uma gangue de ladrões tenta derrubar o Lorde Imperador imortal.",
        indicacao: {
          foto: "img/gato3.png",
          texto: "Ronron! O sistema de magia de alomancia é tão criativo! Quem me dera poder queimar metais como esses personagens! 🐱🌫️"
        }
      },
      {
        titulo: "A Guerra da Papoula",
        autor: "R.F. Kuang",
        capa: "img/Guerra.png",
        ano: 2022,
        paginas: 512,
        descricao: "A órfã Rin escapa da vida de servidão ao entrar na academia militar de elite Sinegard. Em meio à disciplina brutal e ao descobrimento de um dom xamânico perigoso, ela é forçada a confrontar o verdadeiro custo do poder e da vingança quando uma guerra devastadora irrompe no Império Nikan.",
        indicacao: {
          foto: "img/gato4.png",
          texto: "Miau! Fantasia militar com profundidade histórica e personagens complexos. Uma leitura imperdível! 🐱⚔️"
        }
      }
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
      showAlert('Selecione ao menos um gênero para ver as indicações.', 'error'); 
      return; 
    }
    
    // Exibir loader
    showLoader('Nossos gatos estão escolhendo os melhores livros para você...');
    toggleButtonLoading(true);
    
    // Limpar recomendações anteriores
    rec.innerHTML = '';
    
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
          rec.innerHTML = `
            <div class="no-results">
              <h3>Ops! Nossos gatos ainda não têm indicações para esses gêneros</h3>
              <p>Mas eles estão sempre lendo e em breve terão mais recomendações para você!</p>
              <button onclick="location.reload()" class="primary" style="margin-top: 12px;">Tentar Outros Gêneros</button>
            </div>
          `;
        } else {
          // Criar container de lista
          const listaContainer = document.createElement('div');
          listaContainer.className = 'recomendacoes-lista';
          
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
          listaContainer.appendChild(resultsHeader);
          
          // Criar itens de indicação para cada livro
          livrosSelecionados.forEach(livro => {
            const indicationItem = document.createElement('div');
            indicationItem.className = 'indication-item';
            
            indicationItem.innerHTML = `
              <div class="indication-content">
                <div class="gatos-indication">
                  <div class="gatos-header">
                    <img src="${livro.indicacao.foto}" alt="Os Gatos Indicam" class="gatos-photo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiBmaWxsPSIjZjRjNTQyIi8+PHBhdGggZD0iTTIwIDMwIFEzMCAyMCA0MCAzMCBRNTAgNDAgNDAgMzBaIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMyIgZmlsbD0iIzVhMWVhNiIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iMjUiIHI9IjMiIGZpbGw9IiM1YTFlYTYiLz48L3N2Zz4='">
                    <div class="gatos-text">
                      <h4>🐱 Os Gatos Indicam!</h4>
                      <p>${livro.indicacao.texto}</p>
                    </div>
                  </div>
                </div>
                <div class="book-info-side">
                  <div class="book-cover">
                    <img src="${livro.capa}" alt="${livro.titulo}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmY3ZmIiLz48dGV4dCB4PSIxMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9Ik51bml0byIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzViMWVhNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2FwYSBkbyBMaXZybzwvdGV4dD48L3N2Zz4='">
                  </div>
                  <div class="book-details">
                    <h4>${livro.titulo}</h4>
                    <p class="book-authors"><strong>${livro.autor}</strong></p>
                    <div class="book-meta">
                      <span>${livro.ano}</span>
                      ${livro.paginas ? `<span>${livro.paginas} páginas</span>` : ''}
                    </div>
                    <p class="book-description">${livro.descricao}</p>
                  </div>
                </div>
              </div>
            `;
            
            listaContainer.appendChild(indicationItem);
          });
          
          rec.appendChild(listaContainer);
        }
        
      } catch(err) { 
        console.error('Erro:', err); 
        rec.innerHTML = `
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

